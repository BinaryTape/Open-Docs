[//]: # (title: 將 Kotlin 新增至 Java 專案 – 教學)

<web-summary>在現有的 Java 專案中整合 Kotlin — 設定 Maven 或 Gradle 建置檔案、整理原始碼檔案，並在 IntelliJ IDEA 中將 Java 程式碼轉換為 Kotlin。</web-summary>

Kotlin 與 Java 完全互通，因此您可以逐步將其引入現有的 Java 專案，而無需重寫所有內容。

在本教學中，您將學習如何：

* 設定 Maven 或 Gradle 建置工具以編譯 Java 和 Kotlin 程式碼。
* 在專案目錄中組織 Java 和 Kotlin 原始碼檔案。
* 使用 IntelliJ IDEA 將 Java 檔案轉換為 Kotlin。

> 您可以將任何現有的 Java 專案用於本教學，或複製我們已設定好 Maven 和 Gradle 建置檔案的公開[範例專案](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)。
> 
> 您也可以使用我們[準備好的技能](https://github.com/Kotlin/kotlin-agent-skills/blob/main/skills/kotlin-tooling-java-to-kotlin/SKILL.md)，將轉換工作交給您選擇的 AI 代理程式。請記住，AI 處理結果並不完全可以預測。
>
{style="tip"}

## 專案組態

要將 Kotlin 新增至 Java 專案，您需要根據所使用的建置工具，將專案配置為同時使用 Kotlin 和 Java。

專案組態可確保 Kotlin 和 Java 程式碼都能正確編譯，並能無縫地相互引用。

### Maven

> 從 **IntelliJ IDEA 2025.3** 開始，當您將第一個 Kotlin 檔案新增至以 Maven 為基礎的 Java 專案時，IDE 會自動更新您的 `pom.xml` 檔案以包含 Kotlin Maven 外掛程式與標準相依性。如果您想自訂版本或建置階段，仍可手動進行配置。
>
{style="note"}

要在 Maven 專案中同時使用 Kotlin 和 Java，請套用 Kotlin Maven 外掛程式並在您的 `pom.xml` 檔案中新增 Kotlin 相依性：

1. 在 `<properties>` 區段中，新增 Kotlin 版本屬性：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. 在 `<dependencies>` 區段中，將必要的相依性新增至 `<plugins>` 區段：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,55"}

3. 在 `<build><plugins>` 區段中，新增 Kotlin 外掛程式：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="57-58,95-96,99-107"}

   在 Kotlin Maven 外掛程式中啟用 `<extensions>true</extensions>` 有助於：

   * 自動將 `kotlin-stdlib` 相依性新增至專案。
   * 配置執行階段以先編譯 Kotlin，再編譯 Java。
   * 在 Java 程式碼中引用 Kotlin 程式碼，反之亦然。

   當使用具有擴充功能的 Kotlin Maven 外掛程式時，您不需要在 `<build><pluginManagement>` 區段中準備個別的 `maven-compiler-plugin`。

4. 重新載入 IDE 中的 Maven 專案。
5. 執行測試以驗證配置：

    ```bash
    ./mvnw clean test
    ```

### Gradle

要在 Gradle 專案中同時使用 Kotlin 和 Java，請套用 Kotlin JVM 外掛程式並在您的 `build.gradle.kts` 檔案中新增 Kotlin 相依性：

1. 在 `plugins {}` 區塊中，新增 Kotlin JVM 外掛程式：

    ```kotlin
    plugins {
        // 其他外掛程式
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. 將 JVM 工具鏈版本設定為與您的 Java 版本相符：

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   這可確保 Kotlin 使用與您的 Java 程式碼相同的 JDK 版本。

3. 在 `dependencies {}` 區塊中，新增提供 Kotlin 測試公用程式並與 JUnit 整合的 `kotlin("test")` 程式庫：

    ```kotlin
    dependencies {
        // 其他相依性
    
        testImplementation(kotlin("test"))
        // 其他測試相依性
    }
    ```

4. 重新載入 IDE 中的 Gradle 專案。
5. 執行您的測試以驗證配置：

    ```bash
    ./gradlew clean test
    ```

## 專案結構

透過此配置，您可以在相同的原始碼目錄中混合使用 Java 和 Kotlin 檔案：

```none
src/
  ├── main/
  │    ├── java/          # Java 和 Kotlin 生產程式碼
  │    └── kotlin/        # 額外的 Kotlin 生產程式碼（選填）
  └── test/
       ├── java/          # Java 和 Kotlin 測試程式碼
       └── kotlin/        # 額外的 Kotlin 測試程式碼（選填）
```

您可以手動建立這些目錄，或者在新增第一個 Kotlin 檔案時讓 IntelliJ IDEA 建立它們。

Kotlin 外掛程式會自動辨識 `src/main/java` 和 `src/test/java` 目錄，因此您可以將 `.kt` 和 `.java` 檔案放在同一個目錄中。

## 將 Java 檔案轉換為 Kotlin

Kotlin 外掛程式還隨附了一個 Java 轉 Kotlin 轉換器（_J2K_），可自動將 Java 檔案轉換為 Kotlin。要對檔案使用 J2K，請在其操作功能表或 IntelliJ IDEA 的 **Code** 功能表中點擊 **Convert Java File to Kotlin File**。

![將 Java 轉換為 Kotlin](convert-java-to-kotlin.png){width=500}

雖然轉換器並非萬無一失，但在將大多數 Java 樣板程式碼轉換為 Kotlin 方面做得相當出色。然而，有時仍需要一些手動調整。

## 探索編譯器外掛程式 {initial-collapse-state="collapsed" collapsible="true"}

如果您有更複雜的專案，使用了 [Spring](https://spring.io/) 或 Java Persistence API (JPA)，您可以使用 Kotlin 編譯器外掛程式，這些外掛程式會自動調整 Kotlin 的語言特性以符合架構預期，從而減少樣板程式碼：

* **[`all-open`](all-open-plugin.md)** 外掛程式在與特定註解搭配使用時，會自動將類別及其成員設定為 `open`。這對於像 Spring 這樣要求類別為 non-final 的架構特別有用。

  對於 Spring，您可以使用專用的 [`kotlin-spring`](all-open-plugin.md#spring-support) 外掛程式，它是 `all-open` 之上的包裝函式，會自動指定 Spring 註解。
* **[`no-arg`](no-arg-plugin.md)** 外掛程式會為具有特定註解的類別產生額外的零引數建構函式。這讓 JPA 能夠具現化原本沒有預設建構函式的類別。

  您也可以使用 [`kotlin-jpa`](no-arg-plugin.md#jpa-support) 外掛程式，它是 `no-arg` 之上的包裝函式，會自動指定 no-arg 註解。
* **[`power-assert`](power-assert.md)** 外掛程式透過為斷言提供包含上下文資訊的詳細失敗訊息，來改善偵錯體驗。它會顯示中間值，幫助您了解測試失敗的原因。

## 下一步

在 Java 專案中開始使用 Kotlin 的最簡單方法是先新增 Kotlin 測試：

[將您的第一個 Kotlin 測試新增至 Java 專案](jvm-test-using-junit.md)

### 延伸閱讀

* [Kotlin 與 Java 互通性詳細資訊](java-to-kotlin-interop.md)
* [Maven 組建組態參考](maven.md)