[//]: # (title: Gradle)

Gradle 是一個建構系統，能協助您自動化和管理建構流程。它會下載所需的依賴項、打包您的程式碼，並為編譯做好準備。在 [Gradle 網站](https://docs.gradle.org/current/userguide/userguide.html)上了解 Gradle 的基礎知識和具體細節。

您可以透過 [這些說明](gradle-configure-project.md) 為不同平台設定您自己的專案，或執行一個小型的 [逐步教學](get-started-with-jvm-gradle-project.md)，該教學將向您展示如何在 Kotlin 中建立一個簡單的後端「Hello World」應用程式。

> 您可以在[此處](gradle-configure-project.md#apply-the-plugin)找到有關 Kotlin、Gradle 和 Android Gradle plugin 版本相容性的資訊。
> 
{style="tip"}

在本章中，您還可以學習：
* [編譯器選項及其傳遞方式](gradle-compiler-options.md)。
* [增量編譯、快取支援、建構報告和 Kotlin daemon](gradle-compilation-and-caches.md)。
* [對 Gradle plugin 變體的支援](gradle-plugin-variants.md)。

## 接下來是什麼？

了解：
* **Gradle Kotlin DSL**。 [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一種領域特定語言，您可以用它來快速高效地編寫建構腳本。
* **Annotation processing**（註解處理）。Kotlin 透過 [Kotlin Symbol processing API](ksp-reference.md) 支援註解處理。
* **Generating documentation**（文件生成）。若要為 Kotlin 專案生成文件，請使用 [Dokka](https://github.com/Kotlin/dokka)；請參閱 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin) 以獲取配置說明。Dokka 支援混合語言專案，並且可以生成多種格式的輸出，包括標準 Javadoc。
* **OSGi**。有關 OSGi 支援，請參閱 [Kotlin OSGi 頁面](kotlin-osgi.md)。