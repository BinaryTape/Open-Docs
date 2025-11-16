[//]: # (title: 將 Kotlin 新增至 Java 專案 – 教學)

Kotlin 與 Java 完全互通，因此您可以逐步將其導入現有 Java 專案，而無需重寫所有內容。

在本教學中，您將學習如何：

*   設定 Maven 或 Gradle 建置工具以編譯 Java 和 Kotlin 程式碼。
*   組織您的專案目錄中的 Java 和 Kotlin 原始碼檔案。
*   使用 IntelliJ IDEA 將 Java 檔案轉換為 Kotlin。

> 您可以將任何現有 Java 專案用於本教學，或複製我們的公開 [範例專案](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)，
> 其中已設定好 Maven 和 Gradle 建置檔案。
>
{style="tip"}

## 專案配置

要將 Kotlin 新增至 Java 專案，您需要配置專案以同時使用 Kotlin 和 Java，具體取決於您使用的建置工具。

專案配置確保 Kotlin 和 Java 程式碼都能正確編譯，並且可以無縫地互相引用。

### Maven

> 從 **IntelliJ IDEA 2025.3** 開始，當您將第一個 Kotlin 檔案新增至 Maven 型 Java 專案時，
> IDE 會自動更新您的 `pom.xml` 檔案以包含 Kotlin Maven plugin 和標準 dependencies。
> 如果您想自訂版本或建置階段，仍然可以手動配置它。
>
{style="note"}

要在 Maven 專案中同時使用 Kotlin 和 Java，請應用 Kotlin Maven plugin 並在您的 `pom.xml` 檔案中新增 Kotlin dependencies：

1.  在 `<properties>` 區段中，新增 Kotlin 版本 property：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2.  在 `<dependencies>` 區段中，新增所需的 dependencies：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3.  在 `<build><plugins>` 區段中，新增 Kotlin plugin：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   在此配置中：

    *   `<extensions>true</extensions>` 讓 Maven 將 Kotlin plugin 整合到建置 lifecycle 中。
    *   自訂 execution phases 允許 Kotlin plugin 先編譯 Kotlin，然後再編譯 Java。
    *   Kotlin 和 Java 程式碼可以透過配置的 `sourceDirs` 目錄互相引用。
    *   使用帶有 extensions 的 Kotlin Maven plugin 時，您不需要在 `<build><pluginManagement>` 區段中單獨設定 `maven-compiler-plugin`。

4.  在您的 IDE 中重新載入 Maven 專案。
5.  執行測試以驗證配置：

    ```bash
    ./mvnw clean test
    ```

### Gradle

要在 Gradle 專案中同時使用 Kotlin 和 Java，請應用 Kotlin JVM plugin 並在您的 `build.gradle.kts` 檔案中新增 Kotlin dependencies：

1.  在 `plugins {}` 區塊中，新增 Kotlin JVM plugin：

    ```kotlin
    plugins {
        // 其他 plugin
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2.  設定 JVM toolchain 版本以符合您的 Java 版本：

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   這確保 Kotlin 使用與您的 Java 程式碼相同的 JDK 版本。

3.  在 `dependencies {}` 區塊中，新增 `kotlin("test")` 函式庫，它提供 Kotlin 測試 utilities 並與 JUnit 整合：

    ```kotlin
    dependencies {
        // 其他 dependencies
    
        testImplementation(kotlin("test"))
        // 其他測試 dependencies
    }
    ```

4.  在您的 IDE 中重新載入 Gradle 專案。
5.  執行您的測試以驗證配置：

    ```bash
    ./gradlew clean test
    ```

## 專案結構

透過此配置，您可以在相同的原始碼目錄中混合 Java 和 Kotlin 檔案：

```none
src/
  ├── main/
  │    ├── java/          # Java 和 Kotlin 正式程式碼
  │    └── kotlin/        # 額外 Kotlin 正式程式碼（可選）
  └── test/
       ├── java/          # Java 和 Kotlin 測試程式碼
       └── kotlin/        # 額外 Kotlin 測試程式碼（可選）
```

您可以手動建立這些目錄，或讓 IntelliJ IDEA 在您新增第一個 Kotlin 檔案時建立它們。

Kotlin plugin 會自動識別 `src/main/java` 和 `src/test/java` 目錄，因此您可以將 `.kt` 和 `.java` 檔案保留在相同的目錄中。

## 將 Java 檔案轉換為 Kotlin

Kotlin plugin 也捆綁了一個 Java 到 Kotlin 的轉換器 (_J2K_)，它會自動將 Java 檔案轉換為 Kotlin。
要在檔案上使用 J2K，請點擊其上下文選單或 IntelliJ IDEA 的 **Code** 選單中的 **Convert Java File to Kotlin File**。

![將 Java 轉換為 Kotlin](convert-java-to-kotlin.png){width=500}

雖然這個轉換器並非萬無一失，但它在將大部分 Java 樣板程式碼轉換為 Kotlin 方面做得相當不錯。
不過，有時仍然需要一些手動調整。

## 下一步

在 Java 專案中開始使用 Kotlin 最簡單的方法是首先新增 Kotlin 測試：

[將您的第一個 Kotlin 測試新增至 Java 專案](jvm-test-using-junit.md)

### 另請參閱

*   [Kotlin 和 Java 互通性詳細資訊](java-to-kotlin-interop.md)
*   [Maven 建置配置參考](maven.md)