#include <iostream>
#include <random>
#include "httplib.h"
#include <string>
#include <sstream>
#include <vector>
#include <regex>

using namespace std;

// Gera uma seed segura multiplataforma usando std::random_device
unsigned int getSecureSeed() {
    std::random_device rd;
    // random_device pode gerar uint32_t, para garantir o tipo unsigned int
    return static_cast<unsigned int>(rd());
}

std::mt19937 initGenerator() {
    return std::mt19937(getSecureSeed());
}

std::mt19937 gen = initGenerator();

template<typename T>
int rollDice(T sides) {
    std::uniform_int_distribution<> distrib(1, sides);
    return distrib(gen);
}

int main() {
    httplib::Server svr;

    svr.Options("/roll", [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 204;
        return;
    });

    svr.Post("/roll", [](const httplib::Request& req, httplib::Response& res) {
        std::string command = req.body;

        // Critical failure messages only triggered on first roll (turn 1), based on grandTotalSuccesses
        int sC = 10;
        int eC = 1;
        int sN = 6;

        if (auto it = req.params.find("success_critical_margin"); it != req.params.end())
            try { sC = stoi(it->second); } catch (...) {}
        if (auto it = req.params.find("failure_critical_margin"); it != req.params.end())
            try { eC = stoi(it->second); } catch (...) {}
        if (auto it = req.params.find("success_normal_margin"); it != req.params.end())
            try { sN = stoi(it->second); } catch (...) {}

        if (command.find("!roll") != 0) {
            res.status = 400;
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\": \"Command must start with !roll\"}", "application/json");
            return;
        }

        std::regex regex_group(R"((\d+)d(\d+))");
        std::sregex_iterator iter(command.begin(), command.end(), regex_group);
        std::sregex_iterator end;

        if (iter == end) {
            res.status = 400;
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\": \"Invalid command. Use !roll XdY [+ PdQ...]\"}", "application/json");
            return;
        }

        int grandTotalSuccesses = 0;
        std::stringstream ss;
        ss << "{ \"rolls\": [";

        bool firstGroup = true;

        for (; iter != end; ++iter) {
            int diceCount = stoi((*iter)[1]);
            int diceSides = stoi((*iter)[2]);

            if (!firstGroup) ss << ", ";
            firstGroup = false;

            ss << "{ \"group\": \"" << diceCount << "d" << diceSides << "\", \"roll_details\": [";

            int currentRollCount = diceCount;
            int accumulatedSuccesses = 0;
            int turn = 1;
            bool firstRoll = true;

            while (currentRollCount > 0) {
                vector<int> rollResults;
                for (int i = 0; i < currentRollCount; ++i)
                    rollResults.push_back(rollDice(diceSides));

                if (!firstRoll) ss << ", ";
                firstRoll = false;

                ss << "[";
                for (size_t i = 0; i < rollResults.size(); ++i) {
                    if (i > 0) ss << ", ";
                    ss << rollResults[i];
                }
                ss << "]";

                int count_sC = 0;
                int count_eC = 0;
                int count_sN = 0;

                for (int val : rollResults) {
                    if (val >= sC) count_sC++;
                    else if (val <= eC) count_eC++;
                    else if (val >= sN && val > eC && val < sC) count_sN++;
                }

                int cancel = min(count_sC, count_eC);
                count_sC -= cancel;
                count_eC -= cancel;

                int turnSuccesses = 0;

                if (count_sC > 0 && count_eC == 0) {
                    turnSuccesses = count_sC + count_sN;
                    currentRollCount = count_sC;
                } 
                else if (count_sC == 0 && count_eC == 0) {
                    turnSuccesses = count_sN;
                    currentRollCount = 0;
                } 
                else if (count_sC == 0 && count_eC > 0) {
                    currentRollCount = 0;
                    if (turn == 1) {
                        turnSuccesses = count_sN - count_eC;    
                    } else {
                        turnSuccesses = max(0, (count_sN - count_eC));
                    }
                }

                accumulatedSuccesses += turnSuccesses;
                turn++;
            }

            ss << "], \"total_successes\": " << accumulatedSuccesses << " }";
            grandTotalSuccesses += accumulatedSuccesses;
        }

        ss << "], \"grand_total_successes\": " << grandTotalSuccesses;

        if (grandTotalSuccesses < 0) {
            string failStatus;
            if (grandTotalSuccesses == -1) failStatus = "Falha Crítica Desfavorável: Personagem";
            else if (grandTotalSuccesses == -2) failStatus = "Falha Crítica Prejudicial: Personagem";
            else failStatus = "Falha Crítica Calamitosa: Grupo";
            ss << ", \"status\": \"failure\", \"failure_type\": \"" << failStatus << "\"";
        } else {
            ss << ", \"status\": \"success\"";
        }

        ss << " }";

        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(ss.str(), "application/json");
        res.status = 200;
    });

    std::cout << "[Server ACTIVE] Access POST http://0.0.0.0:8080/roll\n";
    svr.listen("0.0.0.0", 8080);    

    return 0;
}
