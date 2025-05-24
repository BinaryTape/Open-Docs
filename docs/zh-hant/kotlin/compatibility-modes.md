---
title: "相容模式 (Compatibility modes)"
---
當一個大型團隊遷移到新版本時，在某些時候可能會出現「不一致的狀態」，即某些開發人員已經更新，而另一些開發人員尚未更新。為了防止前者編寫和提交其他人可能無法編譯的程式碼，我們提供了以下命令列參數（也可在 IDE 和 [Gradle](gradle-compiler-options)/[Maven](maven#specify-compiler-options) 中使用）：

*   `-language-version X.Y` - Kotlin 語言版本 X.Y 的相容模式，會針對所有後續發布的語言功能報告錯誤。
*   `-api-version X.Y` - Kotlin API 版本 X.Y 的相容模式，會針對所有使用 Kotlin 標準函式庫中較新 API 的程式碼報告錯誤（包括編譯器產生的程式碼）。

目前，除了最新的穩定版本之外，我們還支援至少三個先前的語言和 API 版本的開發。