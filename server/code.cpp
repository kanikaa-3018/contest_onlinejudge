#include <iostream>
#include <vector>
using namespace std;
typedef long long int ll;
#define SPEEDY std::ios_base::sync_with_stdio(0); std::cin.tie(0); std::cout.tie(0);
#define forn(i, n) for (ll i = 0; i < ll(n); ++i)

void solution(){
    ll n;cin>>n;
    ll k=n/2;
    if (n%2){cout<<k*(k+1)+1;return;}
    cout<<k*k+1;
}

int main() {
    SPEEDY;

    solution();
    cout << '\n';
    return 0;
}