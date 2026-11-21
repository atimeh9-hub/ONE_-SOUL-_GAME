ONE SOUL Android app package (PWA)

Is folder mein aapki HTML game ki PWA copy, app icon, manifest aur service worker hain.
Game ka asal gameplay code badalne ka maqsad nahi tha; sirf installable-app metadata add kiya gaya hai.

APK/AAB banane ka agla tareeqa:
1) Is ZIP ko extract karein.
2) Folder ke andar ki tamam files GitHub repository mein upload karein (index.html root mein ho).
3) GitHub repository Settings > Pages mein Deploy from branch, branch main, folder /(root) select karke Save karein.
4) GitHub Pages ka HTTPS website link khul kar check karein ke ONE SOUL game sahi chalti hai.
5) PWABuilder.com par website link paste karke Android package banane ka option use karein.
6) APK ko pehle apne phone par install karke test karein. AAB Play Store upload ke liye use hota hai.

Zaroori:
- Firebase online features ke liye internet aur Firebase configuration/rules kaam karna zaroori hai.
- Ye ZIP APK ya AAB khud nahi hai; ye app packaging ke liye website/PWA source package hai.
- Play Store ke liye signed AAB, developer account, privacy policy, store listing aur Google ki testing/policy requirements alag hoti hain.
- APK/AAB banane se pehle do phones par multiplayer ko test karein. Is package se multiplayer ki correctness ki guarantee nahi hoti.
