[//]: # (title: 相容模式)

當一個大型團隊正在遷移至新版本時，在某些時間點可能會出現「不一致的狀態」，因為有些開發者已經更新，但其他人尚未更新。為了避免前者編寫並提交他人可能無法編譯的程式碼，我們提供了以下命令列開關（也可在 IDE 和 [Gradle](gradle-compiler-options.md)/[Maven](maven.md#specify-compiler-options) 中使用）：

*   `-language-version X.Y` - Kotlin 語言版本 X.Y 的相容模式，會回報所有在之後發布的語言功能錯誤。
*   `-api-version X.Y` - Kotlin API 版本 X.Y 的相容模式，會回報所有使用 Kotlin 標準函式庫中較新 API 的程式碼錯誤（包括編譯器生成的程式碼）。

目前，除了最新的穩定版本外，我們支援至少三個舊版的語言和 API 版本的開發。