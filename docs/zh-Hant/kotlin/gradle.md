[//]: # (title: Gradle)

Gradle 是一個建置系統，可協助您自動化及管理建置流程。它會下載所需的依賴項、打包您的程式碼，並準備好進行編譯。請參閱 [Gradle 網站](https://docs.gradle.org/current/userguide/userguide.html)以了解 Gradle 的基礎知識與詳細資訊。

您可以參考[這些說明](gradle-configure-project.md)為不同平台設定您自己的專案，或透過一個小型的[逐步教學課程](get-started-with-jvm-gradle-project.md)，了解如何在 Kotlin 中建立一個簡單的後端「Hello World」應用程式。

> 您可以在[這裡](gradle-configure-project.md#apply-the-plugin)找到 Kotlin、Gradle 和 Android Gradle 外掛程式版本相容性的相關資訊。
>
{style="tip"}

在本章中，您還可以了解：
* [編譯器選項以及如何傳遞它們](gradle-compiler-options.md)。
* [增量編譯、快取支援、建置報告以及 Kotlin 守護程式](gradle-compilation-and-caches.md)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants.md)。

## 接下來呢？

了解：
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一種領域特定語言 (DSL)，可用於快速有效地編寫建置腳本。
* **註解處理**。Kotlin 透過 [Kotlin Symbol processing API](ksp-reference.md) 支援註解處理。
* **產生文件**。若要為 Kotlin 專案產生文件，請使用 [Dokka](https://github.com/Kotlin/dokka)；請參閱 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin) 以取得設定說明。Dokka 支援混合語言專案，並能產生多種格式的輸出，包括標準 Javadoc。
* **OSGi**。關於 OSGi 支援，請參閱 [Kotlin OSGi 頁面](kotlin-osgi.md)。