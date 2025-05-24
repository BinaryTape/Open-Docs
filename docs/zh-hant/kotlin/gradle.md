---
title: Gradle
---
Gradle 是一個建置系統，可協助自動化和管理建置流程。 它會下載所需的相依性 (dependencies)、封裝程式碼，並為編譯做好準備。 在 [Gradle 網站](https://docs.gradle.org/current/userguide/userguide.html) 上了解 Gradle 的基礎知識和具體細節。

您可以依照[這些說明](gradle-configure-project)針對不同平台設定自己的專案，或者完成一個簡單的[逐步教學](get-started-with-jvm-gradle-project)，它將向您展示如何在 Kotlin 中建立一個簡單的後端 "Hello World" 應用程式。

:::tip
您可以在[這裡](gradle-configure-project#apply-the-plugin)找到關於 Kotlin、Gradle 和 Android Gradle 外掛程式 (plugin) 版本相容性的資訊。

:::

在本章中，您還可以了解：
* [編譯器選項以及如何傳遞它們](gradle-compiler-options)。
* [增量編譯、快取支援、建置報告和 Kotlin daemon](gradle-compilation-and-caches)。
* [對 Gradle 外掛程式變體的支援](gradle-plugin-variants)。

## 接下來做什麼？

了解關於：
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一種領域特定語言 (domain specific language)，您可以使用它來快速有效地編寫建置腳本。
* **註解處理 (Annotation processing)**。 Kotlin 透過 [Kotlin Symbol processing API](ksp-reference) 支援註解處理。
* **產生文件 (Generating documentation)**。 若要為 Kotlin 專案產生文件，請使用 [Dokka](https://github.com/Kotlin/dokka)；請參閱 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README#using-the-gradle-plugin) 以取得配置說明。 Dokka 支援混合語言專案，並且可以產生多種格式的輸出，包括標準 Javadoc。
* **OSGi**。 關於 OSGi 支援，請參閱 [Kotlin OSGi 頁面](kotlin-osgi)。