[//]: # (title: 使用 Kotlin 和 JUnit 測試 Java 程式碼 – 教學)

Kotlin 與 Java 完全互通，這表示您可以使用 Kotlin 撰寫 Java 程式碼的測試，並與專案中現有的 Java 測試一起執行。

在本教學中，您將學習如何：

*   設定混合型 Java–Kotlin 專案以使用 [JUnit 5](https://junit.org/junit5/) 執行測試。
*   新增驗證 Java 程式碼的 Kotlin 測試。
*   使用 Maven 或 Gradle 執行測試。

> 在您開始之前，請確保已具備：
>
> *   [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Community 或 Ultimate 版)，其中包含綁定的 Kotlin 外掛程式
>     或已安裝 [Kotlin 擴充功能](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start) 的 [VS Code](https://code.visualstudio.com/Download)。
> *   Java 17 或更新版本
>
{style="note"}

## 設定專案

1.  在您的 IDE 中，從版本控制複製範例專案：

    ```text
    https://github.com/kotlin-hands-on/kotlin-junit-sample.git
    ```

2.  導覽至 `initial` 模組並檢閱專案結構：

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java 原始碼
    │   │   └── test/java/    # Java 中的 JUnit 測試
    │   ├── pom.xml           # Maven 設定
    │   └── build.gradle.kts  # Gradle 設定
    ```

    `initial` 模組包含一個簡單的 Java Todo 應用程式，帶有一個測試。

3.  在同一目錄中，開啟 Maven 的 `pom.xml` 或 Gradle 的 `build.gradle.kts` 建構檔案，並更新其內容以支援 Kotlin：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml 檔案"}

    *   在 `<properties>` 區段中，設定 Kotlin 版本。
    *   在 `<dependencies>` 區段中，新增 JUnit Jupiter 依賴項和 `kotlin-stdlib` (測試範圍)，以編譯和執行 Kotlin 測試。
    *   在 `<build><plugins>` 區段中，套用啟用 `extensions` 的 `kotlin-maven-plugin`，並設定 Kotlin 和 Java 的 `compile` 和 `test-compile` 執行與 `sourceDirs`。
    *   使用啟用擴充功能的 Kotlin Maven 外掛程式時，您不需要將 `maven-compiler-plugin` 新增到 `<build><pluginManagement>` 區段。

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
    group = "org.jetbrains.kotlin"
    version = "1.0-SNAPSHOT"
    description = "kotlin-junit-complete"
    java.sourceCompatibility = JavaVersion.VERSION_17
    
    plugins {
        application
        kotlin("jvm") version "%kotlinVersion%"
    }

    kotlin {
        jvmToolchain(17)
    }

    application {
        mainClass.set("org.jetbrains.kotlin.junit.App")
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("com.gitlab.klamonte:jexer:1.6.0")

        testImplementation(kotlin("test"))
        testImplementation(libs.org.junit.jupiter.junit.jupiter.api)
        testImplementation(libs.org.junit.jupiter.junit.jupiter.params)
        testRuntimeOnly(libs.org.junit.jupiter.junit.jupiter.engine)
        testRuntimeOnly(libs.org.junit.platform.junit.platform.launcher)
    }

    tasks.test {
        useJUnitPlatform()
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts 檔案"}

    *   在 `plugins {}` 區塊中，新增 `kotlin("jvm")` 外掛程式。
    *   設定 JVM 工具鏈版本以符合您的 Java 版本。
    *   在 `dependencies {}` 區塊中，新增 `kotlin.test` 函式庫，該函式庫提供 Kotlin 的測試工具並與 JUnit 整合。

    </tab>
    </tabs>

4.  在您的 IDE 中重新載入建構檔案。

有關建構檔案設定的更多詳細說明，請參閱 [專案設定](mixing-java-kotlin-intellij.md#project-configuration)。

## 新增您的第一個 Kotlin 測試

`initial/src/test/java` 中的 `TodoItemTest.java` 測試已驗證應用程式的基本功能：項目建立、預設值、唯一 ID 和狀態變更。

您可以透過新增驗證儲存庫層級行為的 Kotlin 測試來擴展測試覆蓋範圍：

1.  導覽至相同的測試原始碼目錄 `initial/src/test/java`。
2.  在與 Java 測試相同的套件中建立 `TodoRepositoryTest.kt` 檔案。
3.  建立帶有欄位宣告和設定函式的測試類別：

    ```kotlin
    package org.jetbrains.kotlin.junit

    import org.junit.jupiter.api.BeforeEach
    import org.junit.jupiter.api.Assertions
    import org.junit.jupiter.api.Test
    import org.junit.jupiter.api.DisplayName

    internal class TodoRepositoryTest {
        lateinit var repository: TodoRepository
        lateinit var testItem1: TodoItem
        lateinit var testItem2: TodoItem

        @BeforeEach
        fun setUp() {
            repository = TodoRepository()
            testItem1 = TodoItem("Task 1", "Description 1")
            testItem2 = TodoItem("Task 2", "Description 2")
        }
    }
    ```

    *   JUnit 5 註解在 Kotlin 中與 Java 中運作方式相同。
    *   在 Kotlin 中，[`lateinit` 關鍵字](properties.md#late-initialized-properties-and-variables) 允許宣告稍後初始化的非空屬性。
        這有助於避免在測試中使用可空類型 (`TodoRepository?`)。

4.  在 `TodoRepositoryTest` 類別中新增一個測試，以檢查初始儲存庫狀態及其大小：

    ```kotlin
    @Test
    @DisplayName("Should start with empty repository")
    fun shouldStartEmpty() {
        Assertions.assertEquals(0, repository.size())
        Assertions.assertTrue(repository.all.isEmpty())
    }
    ```

    *   與 Java 靜態匯入不同，Jupiter 的 `Assertions` 作為一個類別匯入，並用作斷言函式的限定符。
    *   您可以像在 Kotlin 中使用 `repository.all` 一樣，將 Java getter 函式作為屬性存取，而不是呼叫 `.getAll()`。

5.  撰寫另一個測試以驗證所有項目的複製行為：

    ```kotlin
    @Test
    @DisplayName("Should return defensive copy of items")
    fun shouldReturnDefensiveCopy() {
        repository.add(testItem1)

        val items1 = repository.all
        val items2 = repository.all

        Assertions.assertNotSame(items1, items2)
        Assertions.assertThrows(
            UnsupportedOperationException::class.java
        ) { items1.clear() }
        Assertions.assertEquals(1, repository.size())
    }
    ```

    *   要從 Kotlin 類別取得 Java 類別物件，請使用 `::class.java`。
    *   您可以將複雜的斷言拆分到多行，而無需使用任何特殊的續行字元。

6.  新增一個測試以驗證透過 ID 尋找項目：

    ```kotlin
    @Test
    @DisplayName("Should find item by ID")
    fun shouldFindItemById() {
        repository.add(testItem1)
        repository.add(testItem2)

         val found = repository.getById(testItem1.id())

         Assertions.assertTrue(found.isPresent)
         Assertions.assertEquals(testItem1, found.get())
    }
    ```

    Kotlin 與 Java 的 [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html) 順暢地協同工作。它會自動將 getter 方法轉換為屬性，這就是為什麼此處將 `isPresent()` 方法作為屬性存取的原因。

7.  撰寫一個測試以驗證項目移除機制：

    ```kotlin
     @Test
     @DisplayName("Should remove item by ID")
     fun shouldRemoveItemById() {
         repository.add(testItem1)
         repository.add(testItem2)

         val removed = repository.remove(testItem1.id())

         Assertions.assertTrue(removed)
         Assertions.assertEquals(1, repository.size())
         Assertions.assertTrue(repository.getById(testItem1.id()).isEmpty)
         Assertions.assertTrue(repository.getById(testItem2.id()).isPresent)
     }
    
     @Test
     @DisplayName("Should return false when removing non-existent item")
     fun shouldReturnFalseForNonExistentRemoval() {
         repository.add(testItem1)

         val removed = repository.remove("non-existent-id")

         Assertions.assertFalse(removed)
         Assertions.assertEquals(1, repository.size())
     }
    ```

    在 Kotlin 中，您可以鏈接方法呼叫和屬性存取，例如 `repository.getById(id).isEmpty`。

> 您可以在 `TodoRepositoryTest` 測試類別中新增更多測試，以涵蓋額外的功能。
> 請參閱範例專案的 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) 模組中的完整原始碼。
>
{style="tip"}

## 執行測試

執行 Java 和 Kotlin 測試以驗證您的專案是否如預期運作：

1.  使用邊欄圖示執行測試：

    ![Run the test](run-test.png)

    您也可以使用命令列從 `initial` 目錄執行所有專案測試：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```bash
    mvn test
    ```

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```bash
    ./gradlew test
    ```

    </tab>
    </tabs>

2.  透過變更其中一個變數值來檢查測試是否正常運作。例如，修改 `shouldAddItem` 測試以預期錯誤的儲存庫大小：

    ```kotlin
    @Test
    @DisplayName("Should add item to repository")
    fun shouldAddItem() {
        repository.add(testItem1)

        Assertions.assertEquals(2, repository.size())  // 從 1 變更為 2
        Assertions.assertTrue(repository.all.contains(testItem1))
    }
    ```

3.  再次執行測試並驗證它是否失敗：

    ![Check the test result. The test has failed](test-failed.png)

> 您可以在範例專案的 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) 模組中找到已完全設定並包含測試的專案。
>
{style="tip"}

## 探索其他測試函式庫

除了 JUnit，您還可以使用其他支援 Kotlin 和 Java 的函式庫：

| 函式庫                                                     | 描述                                                                                                        |
|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | 具有可鏈接斷言的流暢斷言函式庫。                                                                           |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito 的 Kotlin 包裝器，提供輔助函式並與 Kotlin 類型系統更好地整合。                                     |
| [MockK](https://github.com/mockk/mockk)                     | 原生 Kotlin 模擬函式庫，支援 Kotlin 特定功能，包括協程和擴充函式。                                         |
| [Kotest](https://github.com/kotest/kotest)                  | 適用於 Kotlin 的斷言函式庫，提供多種斷言樣式和廣泛的匹配器支援。                                            |
| [Strikt](https://github.com/robfletcher/strikt)             | 適用於 Kotlin 的斷言函式庫，具有類型安全斷言和資料類別支援。                                               |

## 接下來

*   使用 [Kotlin 的 Power-assert 編譯器外掛程式](power-assert.md) 改進您的測試輸出。
*   使用 Kotlin 和 Spring Boot [建立您的第一個伺服器端應用程式](jvm-get-started-spring-boot.md)。
*   探索 [`kotlin.test` 函式庫](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 的功能。