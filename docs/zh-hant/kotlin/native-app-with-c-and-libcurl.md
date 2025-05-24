---
title: "建立一個使用 C 互通性與 libcurl 的應用程式 – 教學"
---
本教學示範如何使用 IntelliJ IDEA 建立命令列應用程式。您將學習如何建立一個簡單的 HTTP 客戶端，該客戶端可以使用 Kotlin/Native 和 libcurl 函式庫在本機於指定平台上執行。

輸出將是一個可執行命令列應用程式，您可以在 macOS 和 Linux 上執行它，並發出簡單的 HTTP GET 請求。

您可以使用命令列直接或透過腳本檔案（例如 `.sh` 或 `.bat` 檔案）產生 Kotlin 函式庫。但是，對於具有數百個檔案和函式庫的大型專案，此方法的可擴展性不佳。使用建構系統可以簡化流程，方法是下載和快取具有傳遞依賴項的 Kotlin/Native 編譯器二進位檔和函式庫，以及執行編譯器和測試。Kotlin/Native 可以透過 [Kotlin Multiplatform plugin（Kotlin 多平台外掛程式）](gradle-configure-project#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 建構系統。

## 開始之前

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 透過在 IntelliJ IDEA 中選擇 **File（檔案）** | **New（新增）** | **Project from Version Control（從版本控制建立專案）** 並使用以下 URL，來複製 [project template（專案範本）](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 探索專案結構：

   <img src="/img/native-project-structure.png" alt="Native application project structure" width="700" style={{verticalAlign: 'middle'}}/>

   此範本包含一個專案，其中包含您開始所需的所有檔案和資料夾。務必了解，如果程式碼沒有平台特定的要求，則以 Kotlin/Native 撰寫的應用程式可以針對不同的平台。您的程式碼位於 `nativeMain` 目錄中，並具有對應的 `nativeTest`。在本教學中，請保持資料夾結構不變。

4. 開啟 `build.gradle.kts` 檔案，此建構腳本包含專案設定。請特別注意建構檔案中的以下內容：

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 `->` macosX64("native")
            hostOs == "Linux" && isArm64 `->` linuxArm64("native")
            hostOs == "Linux" && !isArm64 `->` linuxX64("native")
            isMingwX64 `->` mingwX64("native")
            else `->` throw GradleException("Host OS is not supported in Kotlin/Native.")
        }
    
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                }
            }
        }
    }
    
    ```

   * 目標是使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 針對 macOS、Linux 和 Windows 定義的。請參閱 [supported platforms（支援的平台）](native-target-support)的完整清單。
   * 條目本身定義了一系列屬性，以指示如何產生二進位檔以及應用程式的進入點。這些可以保留為預設值。
   * C 互通性設定為建構中的額外步驟。預設情況下，C 中的所有符號都會匯入到 `interop` 套件。您可能想要在 `.kt` 檔案中匯入整個套件。深入了解 [how to configure（如何設定）](gradle-configure-project#targeting-multiple-platforms)它。

## 建立定義檔案

在撰寫原生應用程式時，您通常需要存取 [Kotlin standard library（Kotlin 標準函式庫）](https://kotlinlang.org/api/latest/jvm/stdlib/)中未包含的某些功能，例如發出 HTTP 請求、從磁碟讀取和寫入等等。

Kotlin/Native 可協助使用標準 C 函式庫，從而開啟一個完整的生態系統，其中包含您可能需要的幾乎所有功能。Kotlin/Native 已隨附一組預先建構的 [platform libraries（平台函式庫）](native-platform-libs)，這些函式庫為標準函式庫提供了一些額外的常見功能。

互通的理想情況是呼叫 C 函數，就像呼叫 Kotlin 函數一樣，遵循相同的簽名和慣例。這時 cinterop 工具就派上用場了。它會採用 C 函式庫並產生相應的 Kotlin 繫結，以便可以像使用 Kotlin 程式碼一樣使用該函式庫。

若要產生這些繫結，每個函式庫都需要一個定義檔案，通常與函式庫的名稱相同。這是一個屬性檔案，用於精確地描述應如何使用該函式庫。

在此應用程式中，您需要 libcurl 函式庫來發出一些 HTTP 呼叫。若要建立其定義檔案：

1. 選取 `src` 資料夾，然後使用 **File（檔案）| New（新增）| Directory（目錄）** 建立新目錄。
2. 將新目錄命名為 **nativeInterop/cinterop**。這是標頭檔位置的預設慣例，但如果您使用其他位置，則可以在 `build.gradle.kts` 檔案中覆寫它。
3. 選取此新子資料夾，然後使用 **File（檔案）| New（新增）| File（檔案）** 建立新的 `libcurl.def` 檔案。
4. 使用以下程式碼更新您的檔案：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是要為其產生 Kotlin Stub 的標頭檔清單。您可以將多個檔案新增到此條目，並以空格分隔每個檔案。在本例中，它僅為 `curl.h`。參考的檔案需要在指定的路徑上可用（在本例中，它是 `/usr/include/curl`）。
   * `headerFilter` 顯示了具體包含的內容。在 C 中，當一個檔案使用 `#include` 指令參考另一個檔案時，也會包含所有標頭。有時沒有必要這樣做，您可以 [using glob patterns（使用 Glob 模式）](https://en.wikipedia.org/wiki/Glob_(programming))新增此參數以進行調整。

     如果您不想將外部依賴項（例如系統 `stdint.h` 標頭）提取到 interop 函式庫中，則可以使用 `headerFilter`。此外，它對於函式庫大小優化以及修復系統和提供的 Kotlin/Native 編譯環境之間可能存在的衝突可能很有用。

   * 如果需要修改特定平台的行為，則可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 之類的格式，以將平台特定的值提供給選項。在本例中，它們是 macOS（`.osx` 後綴）和 Linux（`.linux` 後綴）。也可以使用沒有後綴的參數（例如，`linkerOpts=`），並且將其應用於所有平台。

   有關可用選項的完整清單，請參閱 [Definition file（定義檔案）](native-definition-file#properties)。

:::note
您需要在系統上安裝 `curl` 函式庫二進位檔才能使範例正常運作。在 macOS 和 Linux 上，它們通常包含在內。在 Windows 上，您可以從 [sources（來源）](https://curl.se/download.html) 建構它（您需要 Microsoft Visual Studio 或 Windows SDK 命令列工具）。有關更多詳細資訊，請參閱 [related blog post（相關網誌文章）](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，您可能需要考慮使用 [MinGW/MSYS2](https://www.msys2.org/) `curl` 二進位檔。

:::

## 將互通性新增到建構流程

若要使用標頭檔，請確保將它們產生為建構流程的一部分。為此，請將以下條目新增到 `build.gradle.kts` 檔案：

```kotlin
nativeTarget.apply {
    compilations.getByName("main") {
        cinterops {
            val libcurl by creating
        }
    }
    binaries {
        executable {
            entryPoint = "main"
        }
    }
}
```

首先，新增 `cinterops`，然後新增定義檔案的條目。預設情況下，使用檔案的名稱。您可以使用其他參數覆寫此設定：

```kotlin
cinterops {
    val libcurl by creating {
        definitionFile.set(project.file("src/nativeInterop/cinterop/libcurl.def"))
        packageName("com.jetbrains.handson.http")
        compilerOpts("-I/path")
        includeDirs.allHeaders("path")
    }
}
```

## 撰寫應用程式程式碼

現在您有了函式庫和相應的 Kotlin Stub，您可以從您的應用程式中使用它們。對於本教學，請將 [simple.c](https://curl.se/libcurl/c/simple.html) 範例轉換為 Kotlin。

在 `src/nativeMain/kotlin/` 資料夾中，使用以下程式碼更新您的 `Main.kt` 檔案：

```kotlin
import kotlinx.cinterop.*
import libcurl.*

@OptIn(ExperimentalForeignApi::class)
fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

如您所見，在 Kotlin 版本中消除了明確的變數宣告，但其他所有內容與 C 版本幾乎相同。您希望在 libcurl 函式庫中看到的所有呼叫都可以在 Kotlin 等效項中使用。

:::note
這是一個逐行文字翻譯。您也可以使用更符合 Kotlin 習慣的方式撰寫它。

:::

## 編譯並執行應用程式

1. 編譯應用程式。為此，請從任務清單中執行 `runDebugExecutableNative` Gradle 任務，或在終端機中使用以下命令：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   在這種情況下，由 cinterop 工具產生的部分會隱式包含在建構中。

2. 如果編譯期間沒有錯誤，請按一下 `main()` 函數旁邊的裝訂邊中的綠色 **Run（執行）** 圖示，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷方式。

   IntelliJ IDEA 會開啟 **Run（執行）** 標籤並顯示輸出 — [example.com](https://example.com/) 的內容：

   <img src="/img/native-output.png" alt="Application output with HTML-code" width="700" style={{verticalAlign: 'middle'}}/>

您可以看到實際輸出，因為呼叫 `curl_easy_perform` 會將結果列印到標準輸出。您可以使用 `curl_easy_setopt` 隱藏此輸出。

您可以在我們的 [GitHub repository（GitHub 儲存庫）](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 中取得完整的專案程式碼。

:::

## 後續步驟

深入了解 [Kotlin's interoperability with C（Kotlin 與 C 的互通性）](native-c-interop)。