[//]: # (title: 使用 C 互通與 libcurl 建立應用程式 – 教學)

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 `cinterop` 工具從 C 程式庫產生的 Kotlin 宣告都應包含 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅針對部分 API 要求選擇性加入 (opt-in)。
>
{style="note"}

本教學示範如何使用 IntelliJ IDEA 建立一個命令列應用程式。你將學習如何建立一個簡單的 HTTP 用戶端，並使用 Kotlin/Native 和 `libcurl` 程式庫在指定的平台上原生執行。

輸出結果將是一個可執行的命令列應用程式，你可以在 macOS 和 Linux 上執行它並發送簡單的 HTTP GET 請求。

你可以直接使用命令列或透過指令碼檔案（如 `.sh` 或 `.bat` 檔案）來產生 Kotlin 程式庫。然而，對於擁有數百個檔案和程式庫的大型專案，這種方法的可擴充性並不理想。使用建置系統可以簡化程序，它能下載並快取具有遞移相依性的 Kotlin/Native 編譯器二進位檔案與程式庫，並執行編譯器和測試。Kotlin/Native 可以透過 [Kotlin 多平台外掛程式](gradle-configure-project.md#targeting-multiple-platforms)來使用 [Gradle](https://gradle.org) 建置系統。

## 開始之前

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 透過在 IntelliJ IDEA 中選擇 **File** | **New** | **Project from Version Control** 並使用以下 URL 來複製 [專案樣板](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```  

3. 探索專案結構：

   ![原生應用程式專案結構](native-project-structure.png){width=700}

   該樣板包含了一個專案，其中有你開始所需的所有檔案和資料夾。重要的是要了解，如果程式碼沒有特定平台的的需求，使用 Kotlin/Native 編寫的應用程式可以針對不同的平台。你的程式碼放置在 `nativeMain` 目錄中，並有相對應的 `nativeTest`。在本教學中，請保持資料夾結構不變。

4. 開啟 `build.gradle.kts` 檔案，這是包含專案設定的建置指令碼。請特別注意建置檔案中的以下部分：

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
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

   * 目標是使用 `macosArm64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 分別為 macOS、Linux 和 Windows 定義的。請參閱 [受支援平台](native-target-support.md) 的完整清單。
   * `binaries {}` 區塊定義了二進位檔案的產生方式以及應用程式的入口點。這些可以保留為預設值。
   * C 互通（C interoperability）被配置為建置中的一個額外步驟。預設情況下，所有來自 C 的符號都會匯入到 `interop` 套件中。你可能想要在 `.kt` 檔案中匯入整個套件。進一步了解[如何配置](gradle-configure-project.md#targeting-multiple-platforms)。

## 建立定義檔

編寫原生應用程式時，你通常需要存取 [Kotlin 標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/) 中未包含的某些功能，例如發送 HTTP 請求、讀寫磁碟等等。

Kotlin/Native 有助於取用標準 C 程式庫，從而開啟了一個功能齊全的生態系統，幾乎可以滿足你的任何需求。Kotlin/Native 已經隨附了一組預建的 [平台程式庫](native-platform-libs.md)，這些程式庫為標準函式庫提供了一些額外的通用功能。

互通的理想情況是像呼叫 C 函式一樣呼叫 Kotlin 函式，並遵循相同的簽章與慣例。這就是 `cinterop` 工具派上用場的時候。它接收一個 C 程式庫並產生相對應的 Kotlin 繫結，以便該程式庫可以像 Kotlin 程式碼一樣被使用。

為了產生這些繫結，每個程式庫都需要一個定義檔，通常與程式庫同名。這是一個屬性檔案，精確描述了應如何取用該程式庫。

在這個應用程式中，你需要 `libcurl` 程式庫來發送一些 HTTP 呼叫。要建立其定義檔：

1. 選擇 `src` 資料夾，然後透過 **File | New | Directory** 建立一個新目錄。
2. 將新目錄命名為 **nativeInterop/cinterop**。這是標頭檔位置的預設慣例，但如果你使用不同的位置，也可以在 `build.gradle.kts` 檔案中進行覆寫。
3. 選擇此新子資料夾，並透過 **File | New | File** 建立一個新的 `libcurl.def` 檔案。
4. 使用以下程式碼更新你的檔案：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是要為其產生 Kotlin 虛設常式的標頭檔清單。你可以在此處新增多個檔案，並以空格分隔。在這種情況下，只有 `curl.h`。所參照的檔案需要在指定的路徑上可用（在這種情況下為 `/usr/include/curl`）。
   * `headerFilter` 顯示具體包含的內容。在 C 語言中，當一個檔案使用 `#include` 指示詞參照另一個檔案時，所有的標頭檔也會被包含進來。有時這不是必要的，你可以[使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming))新增此參數來進行調整。

     如果你不想將外部相依性（例如系統的 `stdint.h` 標頭檔）提取到互通程式庫中，可以使用 `headerFilter`。此外，這對於程式庫大小最佳化以及解決系統與提供的 Kotlin/Native 編譯環境之間潛在的衝突也很有用。

   * 如果需要修改特定平台的行為，你可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 之類的格式來為選項提供特定平台的數值。在這種情況下，它們是 macOS（使用 `.osx` 後綴）和 Linux（使用 `.linux` 後綴）。不帶後綴的參數也是可行的（例如 `linkerOpts=`），並會套用於所有平台。

   有關可用選項的完整清單，請參閱 [定義檔](native-definition-file.md#properties)。

> 你需要在系統上安裝 `curl` 程式庫二進位檔案才能使範例正常運作。在 macOS 和 Linux 上，它們通常已經包含在內。在 Windows 上，你可以從 [原始碼](https://curl.se/download.html) 進行編譯（你需要 Microsoft Visual Studio 或 Windows SDK 命令列工具）。如需更多詳細資訊，請參閱 [相關部落格文章](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，你也可以考慮使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二進位檔案。
>
{style="note"}

## 在建置程序中加入互通性

要使用標頭檔，請確保它們是作為建置程序的一部分產生的。為此，請將以下 `compilations {}` 區塊新增至 `build.gradle.kts` 檔案中：

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

首先加入 `cinterops`，然後是定義檔的條目。預設情況下會使用檔案的名稱。你可以使用額外的參數來覆寫它：

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

## 編寫應用程式程式碼

現在你已經有了程式庫和相對應的 Kotlin 虛設常式，你可以在應用程式中使用它們了。在本教學中，我們將 [simple.c](https://curl.se/libcurl/c/simple.html) 範例轉換為 Kotlin。

在 `src/nativeMain/kotlin/` 資料夾中，使用以下程式碼更新你的 `Main.kt` 檔案：

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

如你所見，在 Kotlin 版本中消除了明確的變數宣告，但其他所有內容幾乎與 C 版本相同。你在 `libcurl` 程式庫中預期的所有呼叫在 Kotlin 對應版本中皆可使用。

> 這是一個逐行的字面翻譯。你也可以用更符合 Kotlin 慣用法的方式來編寫。
>
{style="tip"}

## 編譯並執行應用程式

1. 編譯應用程式。要執行此操作，請從任務清單中執行 `runDebugExecutableNative` Gradle 任務，或在終端機中使用以下指令：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   在這種情況下，由 `cinterop` 工具產生的部分會隱式地包含在建置中。

2. 如果編譯過程中沒有錯誤，請點擊 `main()` 函式旁邊邊欄中的綠色 **Run** 圖示，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快速鍵。

   IntelliJ IDEA 會開啟 **Run** 標籤並顯示輸出內容 — [example.com](https://example.com/) 的內容：

   ![包含 HTML 程式碼的應用程式輸出](native-output.png){width=700}

你可以看到實際的輸出，因為 `curl_easy_perform` 呼叫會將結果列印到標準輸出。你可以使用 `curl_easy_setopt` 來隱藏它。

> 你可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/intro-kotlin-native) 中獲取完整的專案程式碼。
>
{style="note"}

## 下一步

進一步了解 [Kotlin 與 C 的互通性](native-c-interop.md)。