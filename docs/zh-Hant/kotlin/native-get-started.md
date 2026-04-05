[//]: # (title: Kotlin/Native 快速入門)

並用花括號將其括起來 – `${it.length}`。`it` 是 [Lambda 參數](coding-conventions.md#lambda-parameters) 的預設名稱。

   ```kotlin
   fun main() {
       // 讀取輸入值。
       println("Hello, enter your name:")
       val name = readln()
       // 計算名字中的字母數量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 執行應用程式。
5. 輸入您的名字並查看結果：

   ![應用程式輸出](native-output-gutter-2.png){width=500}

現在讓我們僅計算您名字中不重複的字母：

1. 在 `Main.kt` 檔案中，為 `String` 宣告新的 [擴充函式](extensions.md#extension-functions) `.countDistinctCharacters()`：

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函式將名字轉換為小寫。
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函式將輸入字串轉換為字元列表。
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函式僅選擇名字中不重複的字元。
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式計算不重複字元的數量。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函式計算您名字中不重複的字母：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 讀取輸入值。
       println("Hello, enter your name:")
       val name = readln()
       // 計算名字中的字母數量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // 列印不重複字母的數量。
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 執行應用程式。
4. 輸入您的名字並查看結果：

   ![應用程式輸出](native-output-gutter-3.png){width=500}

## 使用 Gradle

在本節中，您將學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/Native 應用程式。它是 Kotlin/Native 和 Kotlin Multiplatform 專案的預設建置系統，也常用於 Java、Android 和其他生態系統。

在建置 Kotlin/Native 專案時，Kotlin Gradle 外掛程式會下載以下構件：

* 主要的 Kotlin/Native 套件，其中包括不同的工具，如 `konanc`、`cinterop` 和 `jsinterop`。預設情況下，Kotlin/Native 套件會作為簡單的 Gradle 相依性從 [Maven Central](https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) 存儲庫下載。
* `konanc` 本身所需的相依性，例如 `llvm`。它們是使用自訂邏輯從 JetBrains CDN 下載的。

您可以在 Gradle 建置指令碼的 `repositories {}` 區塊中更改主要套件下載的來源。

### 建立專案檔案

1. 首先，安裝相容版本的 [Gradle](https://gradle.org/install/)。請參閱 [相容性表](gradle-configure-project.md#apply-the-plugin) 以檢查 Kotlin Gradle 外掛程式 (KGP) 與可用 Gradle 版本的相容性。
2. 建立一個空的專案目錄。在其中，建立一個具有以下內容的 `build.gradle(.kts)` 檔案：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       // 指定下載主要套件的來源
       // 預設使用 Maven Central
       mavenCentral()
   }

   kotlin {
       macosArm64()    // 在 macOS 上
       // linuxArm64() // 在 Linux 上
       // mingwX64()   // 在 Windows 上
   
       targets.withType<KotlinNativeTarget>().configureEach {
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       // 指定下載主要套件的來源
       // 預設使用 Maven Central
       mavenCentral()
   }

   kotlin {
       macosArm64()    // 在 macOS 上
       // linuxArm64() // 在 Linux 上
       // mingwX64()   // 在 Windows 上
   
       targets.withType(KotlinNativeTarget).configureEach {
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '%gradleVersion%'
       distributionType = 'BIN'
   }
   ```

   </tab>
   </tabs>

   您可以使用不同的 [目標名稱](native-target-support.md)，例如 `macosArm64`、`iosArm64`、`linuxArm64` 和 `mingwX64` 來定義您要編譯程式碼的目標平台。
   目標名稱用於在專案中產生原始碼路徑和任務名稱。

3. 在專案目錄中建立一個空的 `settings.gradle(.kts)` 檔案。
4. 建立 `src/nativeMain/kotlin` 目錄，並在其中放置一個具有以下內容的 `hello.kt` 檔案：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

按照慣例，所有原始碼都位於 `src/<platform name>[Main|Test]/kotlin` 目錄中，其中 `Main` 用於原始碼，`Test` 用於測試。在這種情況下，`<platform name>` 為 `native`。

### 建置並執行專案

1. 從專案根目錄執行針對您目標的 `<yourTargetName>Binaries` 建置指令，例如：

   ```bash
   ./gradlew macosArm64Binaries
   ```

   此指令會建立 `build/bin/<yourTargetName>` 目錄，其中包含兩個目錄：`debugExecutable` 和 `releaseExecutable`。它們包含對應的二進位檔案。

   預設情況下，二進位檔案的名稱與專案目錄名稱相同。

2. 要執行專案，請執行針對您目標的 `build/bin/<yourTargetName>/debugExecutable/<project_name>.kexe` 指令，例如：

   ```bash
   build/bin/macosArm64/DebugExecutable/hello.kexe
   ```

終端機會列印 "Hello, Kotlin/Native!"。

### 在 IDE 中開啟專案

現在，您可以在任何支援 Gradle 的 IDE 中開啟您的專案。如果您使用 IntelliJ IDEA：

1. 選擇 **File** | **Open**。
2. 選擇專案目錄並點擊 **Open**。
   IntelliJ IDEA 會自動偵測這是否為 Kotlin/Native 專案。

如果您在專案中遇到問題，IntelliJ IDEA 會在 **Build** 標籤頁中顯示錯誤訊息。

## 使用命令列編譯器

在本節中，您將學習如何使用命令列工具中的 Kotlin 編譯器建立 Kotlin/Native 應用程式。

### 下載並安裝編譯器

要安裝編譯器：

1. 前往 Kotlin 的 [GitHub 發行版](%kotlinLatestUrl%) 頁面並向下捲動到 **Assets** 區段。
2. 尋找名稱中包含 `kotlin-native` 的檔案，並下載適合您作業系統的版本，例如 `kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz`。
3. 將封存檔解壓縮到您選擇的目錄。
4. 打開您的 Shell 設定檔，並將編譯器的 `/bin` 目錄路徑加入到 `PATH` 環境變數中： 

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> 雖然編譯器輸出不依賴任何專案或虛擬機需求，但編譯器本身需要 Java 1.8 或更高版本的執行環境。它支援 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/)。
>
{style="note"}

### 建立程式

選擇一個工作目錄並建立一個名為 `hello.kt` 的檔案。使用以下程式碼更新它：

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 從主控台編譯程式碼

要編譯應用程式，請使用下載的編譯器執行以下指令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 選項的值指定了輸出檔案的名稱，因此此呼叫會在 macOS 和 Linux 上產生 `hello.kexe` 二進位檔案（在 Windows 上為 `hello.exe`）。

有關可用選項的完整列表，請參閱 [Kotlin 編譯器選項](compiler-reference.md)。

### 執行程式

要執行程式，請在命令列工具中導覽至包含二進位檔案的目錄並執行以下指令：

<tabs>
<tab title="macOS and Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

應用程式會將 "Hello, Kotlin/Native" 列印到標準輸出。

## 下一步

* 完成 [使用 C 互通與 libcurl 建立應用程式](native-app-with-c-and-libcurl.md) 教學，該教學解釋了如何建立原生 HTTP 用戶端並與 C 程式庫進行互通。
* 了解如何 [為實際的 Kotlin/Native 專案編寫 Gradle 建置指令碼](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
* 在 [文件](gradle.md) 中閱讀更多關於 Gradle 建置系統的資訊。