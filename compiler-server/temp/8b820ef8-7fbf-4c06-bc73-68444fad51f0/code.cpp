#include <bits/stdc++.h>
using namespace std;
 
void solve() {
    int n, k; cin >> n >> k;
    int a[n], b[n];
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];
    int s = -1;
    for (int i = 0; i < n; i++) {
        if (b[i] != -1) {
            if (s == -1) s = a[i] + b[i];
            else {
                if (s != a[i] + b[i]) {
                    cout << 0 << '\n';
                    return;
                }
            }
        }
    }
    if (s == -1) {
        sort(a, a+n);
        int mx = a[n-1] - a[0];
        cout << k - mx + 1 << '\n';
        return;
    }
    for (int i = 0; i < n; i++) {
        if (a[i] > s || s - a[i] > k) {
            cout << 0 << '\n';
            return;
        }
    }
    cout << 1 << '\n';
}
 
int main() {
    solve();
    return 0;
}