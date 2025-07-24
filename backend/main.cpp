#include <iostream>
#include <random>
#include <winsock2.h>
#include <Windows.h>
#include <bcrypt.h>
#pragma comment(lib, "bcrypt.lib") // Requires linking with bcrypt.lib
using namespace std; // Avoid using the std::function variable
#include <httplib.h>
#include <string>
#include <sstream>
#include <vector>
#include <regex>

unsigned int getSecureSeed() {
    unsigned int seed;
    NTSTATUS status = BCryptGenRandom(
        NULL,
        reinterpret_cast<PUCHAR>(&seed),
        sizeof(seed),
        BCRYPT_USE_SYSTEM_PREFERRED_RNG
    );

    if (!BCRYPT_SUCCESS(status)) {
        throw std::runtime_error("Error generating secure seed");
    }

    // std::cout << "[INFO] Cryptographic seed: " << seed << std::endl;
    return seed;
}

// Initialize the global generator
std::mt19937 initGenerator() {
    unsigned int seed = getSecureSeed();
    return std::mt19937(seed);
}

std::mt19937 gen = initGenerator(); // Global generator

int rollDice(int sides) {
    std::uniform_int_distribution<> distrib(1, sides); // dY
    return distrib(gen);
}

struct RollAnalysis {
    vector<int> diceResults;
    int critS; // successCriticalCount
    int critF; // failureCriticalCount
    int sucN;  // normalSuccessCount
    int delta;
};

RollAnalysis analyzeRoll(const vector<int>& diceResults, int successCriticalMargin, int failureCriticalMargin, int successNormalMargin) {
    RollAnalysis res;
    res.diceResults = diceResults;
    res.critS = 0;
    res.critF = 0;
    res.sucN = 0;

    for (int val : diceResults) {
        if (val <= failureCriticalMargin) res.critF++;
        else if (val >= successCriticalMargin) res.critS++;
        else if (val >= successNormalMargin) res.sucN++;
    }

    res.delta = res.critS - res.critF;
    return res;
}

int main() {

    // HTTP Server
    httplib::Server svr; // Instance
    svr.Post("/roll", [](const httplib::Request& req, httplib::Response& res) { // Route
        // Wait JSON: { "command": "!roll XdY + ..." }
        std::string command = req.body;

        // Default success/failure margins
        int successCriticalMargin = 10; // Success Critical Margin
        int failureCriticalMargin = 1;  // Failure Critical Margin
        int successNormalMargin = 6;    // Success Margin

        // Optionals parameter margins
        if (auto it = req.params.find("success_critical_margin"); it != req.params.end()) {
            try { successCriticalMargin = stoi(it->second); } catch (...) {}
        }
        if (auto it = req.params.find("failure_critical_margin"); it != req.params.end()) {
            try { failureCriticalMargin = stoi(it->second); } catch (...) {}
        }
        if (auto it = req.params.find("success_normal_margin"); it != req.params.end()) {
            try { successNormalMargin = stoi(it->second); } catch (...) {}
        }

        // Verify "!roll"
        if (command.find("!roll") != 0) {
            res.status = 400;
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\": \"Command must start with !roll\"}", "application/json");
            return;
        }

        // All groups XdY
        std::regex regex_group(R"((\d+)d(\d+))");
        std::sregex_iterator iter(command.begin(), command.end(), regex_group);
        std::sregex_iterator end;

        if (iter == end) {
            res.status = 400;
            // HTTP CORS: Cross-Origin Resource Sharing 
            res.set_header("Access-Control-Allow-Origin", "*"); // Allow any requests from any origin 
            res.set_content("{\"error\": \"Invalid command. Use !roll XdY [+ PdQ...]\"}", "application/json"); // Send the JSON result
            return;
        } 

        int grandTotalSuccesses = 0;
        std::stringstream ss;
        ss << "{ \"rolls\": [";

        bool firstGroup = true;

        for (; iter != end; ++iter) {
            int diceCount = std::stoi((*iter)[1]);
            int diceSides = std::stoi((*iter)[2]);

            if (!firstGroup) ss << ", ";
            firstGroup = false;

            ss << "{ \"group\": \"" << diceCount << "d" << diceSides << "\", \"roll_details\": [";

            int currentRollCount = diceCount;
            int rerollNumber = 1;
            int accumulatedSuccesses = 0;

            bool firstRollInGroup = true;

            // This will hold the summary string e.g. "3d10: (Roll 1 [5,5,10] -> Roll 2 [2] -> Sucessos: 1)"
            std::stringstream rollSummaryStr;
            rollSummaryStr << diceCount << "d" << diceSides << ": (";

            while (currentRollCount > 0) {
                vector<int> rollResults;
                for (int i = 0; i < currentRollCount; i++) {
                    rollResults.push_back(rollDice(diceSides));
                }

                RollAnalysis analysis = analyzeRoll(rollResults, successCriticalMargin, failureCriticalMargin, successNormalMargin);

                if (!firstRollInGroup) {
                    ss << ", ";
                    rollSummaryStr << " -> ";
                }
                firstRollInGroup = false;

                // Print current roll to JSON details
                ss << "{ \"reroll\": " << rerollNumber
                   << ", \"dice\": [";
                for (size_t i = 0; i < rollResults.size(); i++) {
                    ss << rollResults[i];
                    if (i + 1 < rollResults.size()) ss << ", ";
                }
                ss << "], \"critS\": " << analysis.critS
                   << ", \"critF\": " << analysis.critF
                   << ", \"normS\": " << analysis.sucN
                   << ", \"delta\": " << analysis.delta << " }";

                // Append to summary string using "Roll N"
                rollSummaryStr << "Roll " << rerollNumber << " [";
                for (size_t i = 0; i < rollResults.size(); i++) {
                    rollSummaryStr << rollResults[i];
                    if (i + 1 < rollResults.size()) rollSummaryStr << ",";
                }
                rollSummaryStr << "]";

                if (rerollNumber == 1) {
                    // First roll
                    if (analysis.critF > 0 && analysis.critS == 0) {
                        // Failure Critical, delta < 0 and stops
                        accumulatedSuccesses = -analysis.critF;
                        break;
                    } else {
                        accumulatedSuccesses = analysis.sucN + (analysis.critS - analysis.critF);
                    }
                } else {
                    // Next rerolls
                    if (analysis.delta > 0) {
                        accumulatedSuccesses += analysis.sucN + analysis.delta;
                    } else {
                        accumulatedSuccesses += analysis.sucN;
                        break;
                    }
                }

                currentRollCount = (analysis.delta > 0) ? analysis.delta : 0;
                rerollNumber++;
            }

            ss << "], \"total_successes\": " << accumulatedSuccesses << " ";

            rollSummaryStr << " -> Sucessos: " << accumulatedSuccesses << ")";

            grandTotalSuccesses += accumulatedSuccesses;

            // Add the summary string as extra field (optional, can be removed if not needed)
            ss << ", \"summary\": \"" << rollSummaryStr.str() << "\" }";
        }

        ss << "], \"grand_total_successes\": " << grandTotalSuccesses;

        // Final status
        if (grandTotalSuccesses < 0) {
            int absFailures = abs(grandTotalSuccesses);
            string failStatus;
            if (absFailures == 1) failStatus = "Unfavorable Critical Failure for Character";
            else if (absFailures == 2) failStatus = "Detrimental Critical Failure for Character";
            else failStatus = "Calamitous Critical Failure for Group";

            ss << ", \"status\": \"failure\", \"failure_type\": \"" << failStatus << "\"";
        } else {
            ss << ", \"status\": \"success\"";
        }

        ss << " }";

        res.set_header("Access-Control-Allow-Origin", "*"); // Allow any requests from any origin 
        res.set_content(ss.str(), "application/json"); // Send the JSON result
        res.status = 200;
    }); 
    
    std::cout << "[Server ACTIVE] Access POST http://localhost:8080/roll\n";
    svr.listen("localhost", 8080);

    return 0;
}
