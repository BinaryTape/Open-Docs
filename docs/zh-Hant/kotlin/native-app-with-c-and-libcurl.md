[//]: # (title: 使用 C 互通性與 libcurl 建立應用程式 – 教學)

> C 程式庫匯入功能目前為 [Beta](native-c-interop-stability.md) 版。所有由 cinterop 工具從 C 程式庫產生的 Kotlin 宣告
> 都應具備 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台程式庫（例如 Foundation、UIKit 和 POSIX）
> 僅需針對部分 API 選擇加入 (opt-in)。
>
{style="note"}

本教學示範如何使用 IntelliJ IDEA 建立一個命令列應用程式。您將學習如何使用 Kotlin/Native 和 libcurl 程式庫，建立一個可以在指定平台上原生執行的簡單 HTTP 用戶端。

輸出將是一個可執行的命令列應用程式，您可以在 macOS 和 Linux 上執行它，並發出簡單的 HTTP GET 請求。

您可以使用命令列來產生 Kotlin 程式庫，可以直接進行，或透過指令碼檔案（例如 `.sh` 或 `.bat` 檔案）進行。
然而，對於包含數百個檔案和程式庫的大型專案，這種方法的可擴展性不佳。
使用建置系統可以簡化流程，透過下載和快取 Kotlin/Native
編譯器二進位檔以及具有遞移依賴的程式庫，並執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

## 開始之前

1. 下載並安裝最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 中，透過選取 **File** | **New** | **Project from Version Control** 並使用此 URL，來複製 (clone) [專案範本](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```  

3. 探索專案結構：

   ![Native application project structure](native-project-structure.png){width=700}

   此範本包含一個專案，其中包含您入門所需的檔案和資料夾。重要的是要理解，如果程式碼沒有平台特定要求，則以 Kotlin/Native 撰寫的應用程式可以針對不同的平台。您的程式碼位於 `nativeMain` 目錄中，並有對應的 `nativeTest`。對於本教學，請保持資料夾結構不變。

4. 開啟 `build.gradle.kts` 檔案，這是包含專案設定的建置指令碼。請特別注意建置檔案中的以下內容：

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 -> macosX64("native")
            hostOs == "Linux" && isArm64 -> linuxArm64("native")
            hostOs == "Linux" && !isArm64 -> linuxX64("native")
            isMingwX64 -> mingwX64("native")
            else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
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

   * 目標是使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 針對 macOS、Linux 和 Windows 定義的。請參閱 [支援平台](native-target-support.md) 的完整列表。
   * `binaries {}` 區塊定義了二進位檔的產生方式和應用程式的進入點。
     這些可以保留為預設值。
   * C 互通性在建置中配置為一個額外步驟。預設情況下，來自 C 的所有符號都會匯入到 `interop` 套件中。您可能希望在 `.kt` 檔案中匯入整個套件。了解更多關於 [如何配置](gradle-configure-project.md#targeting-multiple-platforms) 的資訊。

## 建立定義檔案

在撰寫原生應用程式時，您通常需要存取 [Kotlin 標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/) 中未包含的某些功能，例如發出 HTTP 請求、從磁碟讀取和寫入等等。

Kotlin/Native 有助於使用標準 C 程式庫，開啟了幾乎您可能需要的任何功能的完整生態系統。Kotlin/Native 已隨附一組預先建置的 [平台程式庫](native-platform-libs.md)，
它們為標準函式庫提供了一些額外的通用功能。

互通性 (interop) 的理想情境是像呼叫 Kotlin 函數一樣呼叫 C 函數，遵循相同的簽章和慣例。這就是 cinterop 工具派上用場的時候。它接收一個 C 程式庫並產生對應的 Kotlin 繫結，以便該程式庫可以像 Kotlin 程式碼一樣使用。

為了產生這些繫結，每個程式庫都需要一個定義檔案，通常與程式庫同名。
這是一個屬性檔案，精確描述了程式庫應如何被使用。

在此應用程式中，您將需要 libcurl 程式庫來進行一些 HTTP 呼叫。要建立其定義檔案：

1. 選取 `src` 資料夾並透過 **File | New | Directory** 建立一個新目錄。
2. 將新目錄命名為 **nativeInterop/cinterop**。這是標頭檔位置的預設慣例，
   儘管如果您使用不同的位置，可以在 `build.gradle.kts` 檔案中覆寫此設定。
3. 選取此新子資料夾並透過 **File | New | File** 建立一個新的 `libcurl.def` 檔案。
4. 使用以下程式碼更新您的檔案：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是要為其產生 Kotlin 存根的標頭檔列表。您可以在此處新增多個檔案，
     每個檔案之間用空格分隔。在本例中，它只有 `curl.h`。引用的檔案需要在指定路徑（在本例中為 `/usr/include/curl`）上可用。
   * `headerFilter` 顯示了確切包含的內容。在 C 語言中，當一個檔案使用 `#include` 指示詞引用另一個檔案時，所有標頭也會被包含。有時這是不必要的，您可以 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 加入此參數進行調整。

     如果您不想將外部依賴（例如系統 `stdint.h` 標頭）引入互通程式庫，可以使用 `headerFilter`。此外，它可能對程式庫大小最佳化以及解決系統與所提供的 Kotlin/Native 編譯環境之間的潛在衝突很有用。

   * 如果需要修改特定平台的行為，您可以使用類似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式為選項提供平台特定值。在本例中，它們是 macOS（`.osx` 後綴）和 Linux（`.linux` 後綴）。
     不帶後綴的參數也是可行的（例如 `linkerOpts=`），並適用於所有平台。

   有關可用選項的完整列表，請參閱 [定義檔案](native-definition-file.md#properties)。

> 您需要系統上擁有 `curl` 程式庫二進位檔才能使範例運作。在 macOS 和 Linux 上，它們通常已包含在內。在 Windows 上，您可以從 [原始碼](https://curl.se/download.html) 建置它（您需要 Microsoft Visual Studio 或
> Windows SDK 命令列工具）。有關更多詳細資訊，請參閱 [相關部落格文章](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。
> 或者，您可能想考慮使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二進位檔。
>
{style="note"}

## 將互通性加入建置流程

要使用標頭檔，請確保它們作為建置流程的一部分產生。為此，請將以下
`compilations {}` 區塊加入 `build.gradle.kts` 檔案：

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

首先，加入 `cinterops`，然後是定義檔案的條目。預設情況下，使用檔案的名稱。
您可以使用額外參數覆寫此設定：

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

## 編寫應用程式碼

現在您擁有了程式庫和對應的 Kotlin 存根，您可以在應用程式中使用它們。
對於本教學，請將 [simple.c](https://curl.se/libcurl/c/simple.html) 範例轉換為 Kotlin。

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

如您所見，Kotlin 版本中消除了明確的變數宣告，但其他一切與 C 版本大致相同。您在 libcurl 程式庫中期望的所有呼叫都可在 Kotlin 等效項中取得。

> 這是一個逐行直譯。您也可以用更符合 Kotlin 慣用方式來編寫。
>
{type="tip"}

## 編譯並執行應用程式

1. 編譯應用程式。為此，請從任務列表執行 `runDebugExecutableNative` Gradle 工作，或在終端機中使用以下命令：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   在本例中，由 cinterop 工具產生的一部分已隱含包含在建置中。

2. 如果編譯期間沒有錯誤，請點擊 `main()` 函數旁邊側邊欄中的綠色 **Run** 圖示，或
   使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快速鍵。

   IntelliJ IDEA 將開啟 **Run** 分頁並顯示輸出 — 即 [example.com](https://example.com/) 的內容：

   ![Application output with HTML-code](native-output.png){width=700}

您可以看到實際輸出，因為 `curl_easy_perform` 呼叫會將結果列印到標準輸出。您可以使用 `curl_easy_setopt` 隱藏此內容。

> 您可以在我們的 [GitHub 儲存庫](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 中取得完整的專案程式碼。
>
{style="note"}

## 下一步

了解更多關於 [Kotlin 與 C 的互通性](native-c-interop.md) 的資訊。