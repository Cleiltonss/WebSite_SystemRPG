#include <iostream>
#include <random>
#include <chrono>
using namespace std; // Avoid using the std::function variable

int main() {
    // Generate all the entropy to the system    
    random_device rd;

    // Verify the entropy (0.0 = fallback | > 0 = true source)
    cout << "[DEBUG] Entropia detectada: " << rd.entropy() << "\n"; 
}
