[//]: # (title: 相容模式)

當大型團隊升級到新版本時，可能會在某個時間點出現「不一致狀態」，即部分開發人員已更新，而其他開發人員尚未更新。為防止前者編寫並提交他人可能無法編譯的程式碼，我們提供了以下命令列開關（在 IDE 和 [Gradle](gradle-compiler-options.md)/[Maven](maven.md#specify-compiler-options) 中也可用）：

*   `-language-version X.Y` - Kotlin 語言版本 X.Y 的相容模式，報告所有稍後推出的語言功能所產生的錯誤。
*   `-api-version X.Y` - Kotlin API 版本 X.Y 的相容模式，報告所有使用 Kotlin 標準函式庫中較新 API 的程式碼所產生的錯誤（包括編譯器生成的程式碼）。

目前，除了最新的穩定版本外，我們還支援至少三個以前的語言和 API 版本的開發。