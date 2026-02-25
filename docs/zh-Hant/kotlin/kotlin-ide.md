[//]: # (title: 用於 Kotlin 開發的 IDE)

<web-summary>JetBrains 為 IntelliJ IDEA 與 Android Studio 提供官方 Kotlin IDE 支援。</web-summary>

JetBrains 為以下 IDE 與程式碼編輯器提供官方 Kotlin 支援：
[IntelliJ IDEA](#intellij-idea) 與 [Android Studio](#android-studio)。

其他 IDE 與程式碼編輯器僅有 Kotlin 社群支援的外掛程式。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是專為 JVM 語言（如 Kotlin 與 Java）設計的 IDE，旨在極大化開發者生產力。
它透過提供智慧的程式碼補全、靜態程式碼分析與重構作業，為您處理常規且重複性的任務。 
它讓您專注於軟體開發中充滿趣味的一面，不僅提高效率，還能帶來愉悅的體驗。

Kotlin 外掛程式隨每個 IntelliJ IDEA 版本一併提供。
每個 IDEA 版本都會引入新功能與升級，以改善 Kotlin 開發者在 IDE 中的體驗。
請參閱 [IntelliJ IDEA 的新功能](https://www.jetbrains.com/idea/whatsnew/)以了解 Kotlin 的最新更新與改進。

若要進一步了解 IntelliJ IDEA，請參閱[官方文件](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是 Android 應用程式開發的官方 IDE，基於 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。 
除了 IntelliJ 強大的程式碼編輯器與開發者工具之外，Android Studio 還提供了更多功能，可提升您在建置 Android 應用程式時的生產力。

Kotlin 外掛程式隨每個 Android Studio 版本一併提供。

若要進一步了解 Android Studio，請參閱[官方文件](https://developer.android.com/studio/intro)。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允許開發人員以不同的程式設計語言（包括 Kotlin）撰寫其應用程式。它也有 Kotlin 外掛程式：最初由 JetBrains 開發，現在 Kotlin 外掛程式由 Kotlin 社群貢獻者支援。

您可以從 [Marketplace 手動安裝 Kotlin 外掛程式](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 小組負責管理 Eclipse 版 Kotlin 外掛程式的開發與貢獻流程。
如果您想為該外掛程式做出貢獻，請向其 [GitHub 上的存儲庫](https://github.com/Kotlin/kotlin-eclipse)發送提取要求。

## 與 Kotlin 語言版本的相容性

對於 IntelliJ IDEA 與 Android Studio，Kotlin 外掛程式隨每個版本一併提供。
當發佈新的 Kotlin 版本時，這些工具會自動建議將 Kotlin 更新至最新版本。
請在 [Kotlin 版本發佈](releases.md#ide-support)中查看最新支援的語言版本。

## 其他 IDE 支援

JetBrains 不為其他 IDE 提供 Kotlin 外掛程式。
然而，一些其他的 IDE 與原始碼編輯器（如 Eclipse、Visual Studio Code 與 Atom）擁有由 Kotlin 社群支援的自有 Kotlin 外掛程式。

您可以使用任何文字編輯器來撰寫 Kotlin 程式碼，但會缺少 IDE 相關功能：程式碼格式化、偵錯工具等等。
若要在文字編輯器中使用 Kotlin，您可以從 Kotlin [GitHub Releases](%kotlinLatestUrl%) 下載最新的 Kotlin 命令列編譯器 (`kotlin-compiler-%kotlinVersion%.zip`) 並[手動安裝](command-line.md#manual-install)。
此外，您也可以使用封裝管理員，例如 [Homebrew](command-line.md#homebrew)、 [SDKMAN!](command-line.md#sdkman) 與 [Snap package](command-line.md#snap-package)。

## 下一步？

* [在 IntelliJ IDEA 中建立主控台應用程式](jvm-get-started.md)
* [使用 Android Studio 建立您的第一個跨平台行動應用程式](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)