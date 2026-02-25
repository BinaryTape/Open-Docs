[//]: # (title: Gradle)

Gradle 是一款建構系統，可協助自動化與管理您的組建程序。它會下載所需的相依性、打包您的程式碼，並為編譯做好準備。請在 [Gradle 官方網站](https://docs.gradle.org/current/userguide/userguide.html)進一步了解 Gradle 的基礎知識與詳細資訊。

您可以根據[這些說明](gradle-configure-project.md)針對不同平台設定您自己的專案，或參考一個簡單的[逐步教學](get-started-with-jvm-gradle-project.md)，它將向您展示如何使用 Kotlin 建立一個簡單的後端 "Hello World" 應用程式。

> 您可以在[此處](gradle-configure-project.md#apply-the-plugin)找到有關 Kotlin、Gradle 和 Android Gradle 外掛程式版本相容性的資訊。
> 
{style="tip"}

在本章節中，您還可以了解：
* [編譯器選項以及如何傳遞它們](gradle-compiler-options.md)。
* [增量編譯、快取支援、組建報告和 Kotlin 守護程序 (daemon)](gradle-compilation-and-caches.md)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants.md)。

## 接下步該做什麼？

了解以下內容：
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一種領域特定語言，您可以用它來快速且高效地編寫組建指令碼。
* **註解處理**。Kotlin 透過 [Kotlin 符號處理 API](ksp-reference.md) 支援註解處理。
* **產生文件**。若要為 Kotlin 專案產生文件，請使用 [Dokka](https://github.com/Kotlin/dokka)；有關配置說明，請參閱 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)。Dokka 支援混合語言專案，並能產生多種格式的輸出，包括標準 Javadoc。
* **OSGi**。有關 OSGi 支援，請參閱 [Kotlin OSGi 頁面](kotlin-osgi.md)。