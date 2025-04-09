---
title: "開始使用 Kotlin/Native"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在本教學中，您將學習如何建立 Kotlin/Native 應用程式。選擇最適合您的工具，並使用以下方式建立您的應用程式：

* **[IDE](#in-ide)**。在這裡，您可以從版本控制系統複製專案範本，並在 IntelliJ IDEA 中使用它。
* **[Gradle 建置系統](#using-gradle)**。為了更好地理解底層的工作原理，請手動為您的專案建立建置檔案。
* **[命令列工具](#using-the-command-line-compiler)**。您可以使用 Kotlin/Native 編譯器，它是標準 Kotlin 發行版的一部分，並直接在命令列工具中建立應用程式。

  主控台編譯可能看起來簡單直接，但它無法很好地擴展到具有數百個檔案和函式庫的大型專案。對於此類專案，我們建議使用 IDE 或建置系統。

使用 Kotlin/Native，您可以為 [不同的目標](native-target-support) 進行編譯，包括 Linux、macOS 和 Windows。雖然可以進行跨平台編譯，這意味著使用一個平台來編譯另一個平台，但在本教學中，您將以您正在編譯的同一平台為目標。

:::note
如果您使用 Mac 並想要為 macOS 或其他 Apple 目標建立和執行應用程式，您還需要先安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它，並接受授權條款。

:::

## 在 IDE 中

在本節中，您將學習如何使用 IntelliJ IDEA 建立 Kotlin/Native 應用程式。您可以使用 Community Edition 和 Ultimate Edition。

### 建立專案

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 透過在 IntelliJ IDEA 中選擇 **File** | **New** | **Project from Version Control** 並使用以下 URL，來複製 [專案範本](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 開啟 `gradle/libs.versions.toml` 檔案，這是專案依賴項的版本目錄。要建立 Kotlin/Native 應用程式，您需要 Kotlin Multiplatform Gradle 插件，它的版本與 Kotlin 相同。確保您使用最新的 Kotlin 版本：

   ```none
   [versions]
   kotlin = "2.1.20"
   ```

4. 按照建議重新載入 Gradle 檔案：

   <img src="/img/load-gradle-changes.png" alt="Load Gradle changes button" width="295" style={{verticalAlign: 'middle'}}/>

有關這些設定的更多資訊，請參閱 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)。

### 建置並執行應用程式

開啟 `src/nativeMain/kotlin/` 目錄中的 `Main.kt` 檔案：

* `src` 目錄包含 Kotlin 原始碼檔案。
* `Main.kt` 檔案包含使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函式列印 "Hello, Kotlin/Native!" 的程式碼。

按下裝訂線中的綠色圖示以執行程式碼：

<img src="/img/native-run-gutter.png" alt="Run the application" width="478" style={{verticalAlign: 'middle'}}/>

IntelliJ IDEA 使用 Gradle 任務執行程式碼，並在 **Run** 標籤中輸出結果：

<img src="/img/native-output-gutter-1.png" alt="Application output" width="331" style={{verticalAlign: 'middle'}}/>

首次執行後，IDE 會在頂部建立相應的執行配置：

<img src="/img/native-run-config.png" alt="Gradle run configuration" width="503" style={{verticalAlign: 'middle'}}/>
:::note
IntelliJ IDEA Ultimate 使用者可以安裝 [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) 插件，該插件允許除錯編譯後的原生可執行檔，並自動為匯入的 Kotlin/Native 專案建立執行配置。

您可以 [配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) 以自動建置您的專案：

1. 前往 **Settings | Build, Execution, Deployment | Compiler**。
2. 在 **Compiler** 頁面上，選取 **Build project automatically**。
3. 應用變更。

現在，當您在類別檔案中進行變更或儲存檔案 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 時，IntelliJ IDEA 會自動執行專案的增量建置。

### 更新應用程式

讓我們在您的應用程式中新增一個功能，以便它可以計算您姓名中的字母數量：

1. 在 `Main.kt` 檔案中，新增程式碼以讀取輸入。使用 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式讀取輸入值並將其分配給 `name` 變數：

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. 要使用 Gradle 執行此應用程式，請指定 `System.in` 作為要在 `build.gradle.kts` 檔案中使用的輸入，並載入 Gradle 變更：

   ```kotlin
   kotlin {
       //...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       //...
   }
   ```
   

3. 消除空格並計算字母：

   * 使用 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函式來移除名稱中的空格。
   * 使用範圍函式 [`let`](scope-functions#let) 在物件上下文中執行函式。
   * 使用 [字串模板](strings#string-templates) 透過新增一個貨幣符號 `$` 並將其括在花括號中 – `${it.length}` 來將您的姓名長度插入字串中。`it` 是 [lambda 參數](coding-conventions#lambda-parameters) 的預設名稱。

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 執行應用程式。
5. 輸入您的姓名並享受結果：

   <img src="/img/native-output-gutter-2.png" alt="Application output" width="422" style={{verticalAlign: 'middle'}}/>

現在讓我們只計算您姓名中唯一的字母：

1. 在 `Main.kt` 檔案中，為 `String` 宣告新的 [擴展函式](extensions#extension-functions) `.countDistinctCharacters()`：

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函式將名稱轉換為小寫。
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函式將輸入字串轉換為字元清單。
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函式僅選取您姓名中不同的字元。
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式計算不同的字元。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函式計算您姓名中唯一的字母：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 執行應用程式。
4. 輸入您的姓名並查看結果：

   <img src="/img/native-output-gutter-3.png" alt="Application output" width="422" style={{verticalAlign: 'middle'}}/>

## 使用 Gradle

在本節中，您將學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/Native 應用程式。它是 Kotlin/Native 和 Kotlin Multiplatform 專案的預設建置系統，也常在 Java、Android 和其他生態系統中使用。

### 建立專案檔案

1. 首先，安裝相容版本的 [Gradle](https://gradle.org/install/)。請參閱 [相容性表格](gradle-configure-project#apply-the-plugin) 以檢查 Kotlin Gradle 插件 (KGP) 與可用 Gradle 版本的相容性。
2. 建立一個空的專案目錄。在其中，建立一個包含以下內容的 `build.gradle(.kts)` 檔案：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "2.1.20"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // on macOS
       // linuxArm64("native") // on Linux
       // mingwX64("native")   // on Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "8.10"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // on macOS
       // linuxArm64('native') // on Linux
       // mingwX64('native')   // on Windows
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '8.10'
       distributionType = 'BIN'
   }
   ```

   </TabItem>
   </Tabs>

   您可以使用不同的 [目標名稱](native-target-support)，例如 `macosArm64`、`iosArm64` `linuxArm64` 和 `mingwX64` 來定義您要編譯程式碼的目標。這些目標名稱可以選擇性地將平台名稱作為參數，在本例中為 `native`。平台名稱用於在專案中產生原始碼路徑和任務名稱。

3. 在專案目錄中建立一個空的 `settings.gradle(.kts)` 檔案。
4. 建立 `src/nativeMain/kotlin` 目錄，並在其中放置一個包含以下內容的 `hello.kt` 檔案：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

按照慣例，所有原始碼都位於 `src/<target name>[Main|Test]/kotlin` 目錄中，其中 `Main` 用於原始碼，`Test` 用於測試。 `<target name>` 對應於建置檔案中指定的目標平台（在本例中為 `native`）。

### 建置並執行專案

1. 從根專案目錄中，執行建置命令：

   ```bash
   ./gradlew nativeBinaries
   ```

   此命令會建立 `build/bin/native` 目錄，其中包含兩個目錄：`debugExecutable` 和 `releaseExecutable`。它們包含相應的二進位檔案。

   預設情況下，二進位檔案的名稱與專案目錄相同。

2. 要執行專案，請執行以下命令：

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

終端機會列印 "Hello, Kotlin/Native!"。

### 在 IDE 中開啟專案

現在，您可以在任何支援 Gradle 的 IDE 中開啟您的專案。如果您使用 IntelliJ IDEA：

1. 選擇 **File** | **Open**。
2. 選取專案目錄並點擊 **Open**。
   IntelliJ IDEA 會自動偵測它是否為 Kotlin/Native 專案。

如果您在專案中遇到問題，IntelliJ IDEA 會在 **Build** 標籤中顯示錯誤訊息。

## 使用命令列編譯器

在本節中，您將學習如何使用命令列工具中的 Kotlin 編譯器建立 Kotlin/Native 應用程式。

### 下載並安裝編譯器

要安裝編譯器：

1. 前往 Kotlin 的 [GitHub releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 頁面。
2. 尋找名稱中包含 `kotlin-native` 的檔案，然後下載適合您作業系統的檔案，例如 `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`。
3. 將封存檔解壓縮到您選擇的目錄。
4. 開啟您的 shell 設定檔，並將編譯器的 `/bin` 目錄的路徑新增至 `PATH` 環境變數：

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

雖然編譯器輸出沒有依賴項或虛擬機器要求，但編譯器本身需要 Java 1.8 或更高版本的執行階段。它受到 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/) 的支援。

:::

### 建立程式

選擇一個工作目錄並建立一個名為 `hello.kt` 的檔案。使用以下程式碼更新它：

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 從主控台編譯程式碼

要編譯應用程式，請使用下載的編譯器執行以下命令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 選項的值指定輸出檔案的名稱，因此此呼叫會在 macOS 和 Linux 上產生 `hello.kexe` 二進位檔案（在 Windows 上產生 `hello.exe`）。

有關可用選項的完整清單，請參閱 [Kotlin compiler options](compiler-reference)。

### 執行程式

要執行程式，請在您的命令列工具中，導航到包含二進位檔案的目錄並執行以下命令：

<Tabs>
<TabItem value="macOS and Linux" label="macOS and Linux">

```none
./hello.kexe
```

</TabItem>
<TabItem value="Windows" label="Windows">

```none
./hello.exe
```

</TabItem>
</Tabs>

應用程式會將 "Hello, Kotlin/Native" 列印到標準輸出。

## 接下來呢？

* 完成 [Create an app using C Interop and libcurl](native-app-with-c-and-libcurl) 教學，其中說明瞭如何建立原生 HTTP 用戶端並與 C 函式庫交互操作。
* 學習如何 [write Gradle build scripts for real-life Kotlin/Native projects](multiplatform-dsl-reference)。
* 在 [文件中](gradle) 閱讀有關 Gradle 建置系統的更多資訊。
```