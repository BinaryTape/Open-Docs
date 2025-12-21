[//]: # (title: Maven)

Maven 是一個建構系統，可協助管理僅 Kotlin 或混合 Kotlin–Java 專案，並自動化您的建構流程。
它適用於基於 JVM 的專案，並下載所需的依賴項、編譯並打包您的程式碼。
在 [Maven](https://maven.apache.org/) 網站上了解更多關於其基礎知識和具體細節。

以下是使用 Kotlin Maven 專案的一般工作流程：

1.  [啟用並配置 Kotlin Maven 外掛程式](maven-configure-project.md#enable-and-configure-the-plugin)。
2.  [宣告儲存庫](maven-configure-project.md#declare-repositories)。
3.  [設定專案依賴項](maven-configure-project.md#set-dependencies)。
4.  [配置原始碼編譯](maven-compile-package.md#configure-source-code-compilation)。
5.  [配置 Kotlin 編譯器](maven-compile-package.md#configure-kotlin-compiler)。
6.  [打包您的應用程式](maven-compile-package.md#package-your-project)。

若要入門，您也可以遵循我們的逐步教學：

*   [配置 Java 專案以搭配 Kotlin 運作](mixing-java-kotlin-intellij.md)
*   [使用 Kotlin 和 JUnit5 測試您的 Java Maven 專案](jvm-test-using-junit.md)

> 您可以查看我們的公開[範例專案](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)，
> 其中已為混合 Kotlin/Java 專案設定好 Maven 和 Gradle 建構檔案。
>
{style="tip"}

## 接下來是什麼？

*   使用 [`power-assert` 外掛程式](power-assert.md#maven)**改善您的偵錯體驗**。
*   使用 [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/)**測量測試覆蓋率並生成報告**。
*   使用 [`kapt` 外掛程式](kapt.md#use-in-maven)**配置註解處理**。
*   使用 [Dokka 文件引擎](dokka-maven.md)**生成文件**。
    它支援混合語言專案，並且可以生成多種格式的輸出，包括標準 Javadoc。
*   透過加入 [`kotlin-osgi-bundle`](kotlin-osgi.md#maven)**啟用 OSGi 支援**。