#include <random>

extern "C" {
    int rollDice() {
        static std::mt19937 gen(42);  // Fixed seed for now (will return to randomness later)
        static std::uniform_int_distribution<> dis(1, 6);
        return dis(gen);
    }
}
