[//]: # (title: 建立一個使用 C 互通性與 libcurl 的應用程式 – 教學)

本教學示範如何使用 IntelliJ IDEA 建立一個命令列應用程式。您將學習如何使用 Kotlin/Native 和 libcurl 函式庫，建立一個可以在指定平台上原生執行的簡單 HTTP 客戶端。

輸出將是一個可執行的命令列應用程式，您可以在 macOS 和 Linux 上執行它並發出簡單的 HTTP GET 請求。

您可以使用命令列直接或透過指令碼檔案 (例如 `.sh` 或 `.bat` 檔案) 生成 Kotlin 函式庫。然而，對於有數百個檔案和函式庫的大型專案來說，這種方法擴展性不佳。使用建置系統可以簡化流程，它能下載並快取 Kotlin/Native 編譯器二進位檔和具有傳遞性依賴項的函式庫，並執行編譯器和測試。Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  透過在 IntelliJ IDEA 中選擇 **File** | **New** | **Project from Version Control** 並使用以下 URL 來複製 [專案範本](https://github.com/Kotlin/kmp-native-wizard)：

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```  

3.  探索專案結構：

    ![Native application project structure](native-project-structure.png){width=700}

    此範本包含一個專案，其中有您入門所需的檔案和資料夾。重要的是要了解，如果程式碼沒有平台特定要求，以 Kotlin/Native 編寫的應用程式可以針對不同平台。您的程式碼位於 `nativeMain` 目錄中，並有對應的 `nativeTest`。對於本教學，請保持資料夾結構不變。

4.  開啟 `build.gradle.kts` 檔案，這是包含專案設定的建置指令碼。請特別注意建置檔案中的以下內容：

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

    *   目標是透過 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 為 macOS、Linux 和 Windows 定義的。請參閱[支援平台](native-target-support.md)的完整列表。
    *   該條目本身定義了一系列屬性，以指示二進位檔的生成方式和應用程式的進入點。這些可以保留為預設值。
    *   C 語言互通性在建置過程中作為額外步驟進行配置。預設情況下，來自 C 的所有符號都會匯入到 `interop` 套件中。您可能希望在 `.kt` 檔案中匯入整個套件。了解更多關於[如何配置](gradle-configure-project.md#targeting-multiple-platforms)它。

## 建立定義檔

編寫原生應用程式時，您通常需要存取 [Kotlin 標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/)中未包含的某些功能，例如發出 HTTP 請求、從磁碟讀取和寫入等等。

Kotlin/Native 有助於使用標準 C 函式庫，開啟了一個完整的功能生態系統，幾乎可以滿足您所需的一切。Kotlin/Native 已隨附一組預建的 [平台函式庫](native-platform-libs.md)，為標準函式庫提供了一些額外的通用功能。

理想的互通性情境是呼叫 C 函數，如同呼叫 Kotlin 函數，遵循相同的簽章和慣例。這就是 `cinterop` 工具派上用場的時候。它接收一個 C 函式庫並生成相應的 Kotlin 綁定，以便該函式庫可以像 Kotlin 程式碼一樣使用。

為了生成這些綁定，每個函式庫都需要一個定義檔，通常與函式庫同名。這是一個屬性檔案，精確描述了函式庫應如何被使用。

在此應用程式中，您將需要 `libcurl` 函式庫來進行一些 HTTP 呼叫。要建立其定義檔：

1.  選擇 `src` 資料夾並透過 **File | New | Directory** 建立一個新目錄。
2.  將新目錄命名為 **nativeInterop/cinterop**。這是標頭檔位置的預設慣例，但如果您使用不同位置，可以在 `build.gradle.kts` 檔案中覆寫此設定。
3.  選擇這個新子資料夾並透過 **File | New | File** 建立一個新的 `libcurl.def` 檔案。
4.  用以下程式碼更新您的檔案：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

    *   `headers` 是要生成 Kotlin 存根 (stub) 的標頭檔列表。您可以在此條目中新增多個檔案，每個檔案之間用空格分隔。在本例中，它只有 `curl.h`。引用的檔案需要位於指定的路徑上 (在本例中，它是 `/usr/include/curl`)。
    *   `headerFilter` 顯示了確切包含的內容。在 C 語言中，當一個檔案使用 `#include` 指令引用另一個檔案時，所有標頭也會被包含進來。有時這沒有必要，您可以使用 [glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 添加此參數以進行調整。

      如果您不想將外部依賴項 (例如系統 `stdint.h` 標頭) 引入互通性函式庫，則可以使用 `headerFilter`。此外，它可能對函式庫大小最佳化以及解決系統與提供的 Kotlin/Native 編譯環境之間潛在衝突很有用。

    *   如果需要修改特定平台的行為，您可以使用類似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式，為選項提供平台特定值。在本例中，它們是 macOS (`.osx` 後綴) 和 Linux (`.linux` 後綴)。沒有後綴的參數也是可能的 (例如，`linkerOpts=`) 並應用於所有平台。

    有關可用選項的完整列表，請參閱 [定義檔](native-definition-file.md#properties)。

> 您需要在系統上安裝 `curl` 函式庫二進位檔才能使範例運作。在 macOS 和 Linux 上，它們通常包含在內。在 Windows 上，您可以從[原始碼](https://curl.se/download.html)建置 (您需要 Microsoft Visual Studio 或 Windows SDK 命令列工具)。有關更多詳細資訊，請參閱[相關部落格文章](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，您可能需要考慮使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二進位檔。
>
{style="note"}

## 將互通性加入建置流程

若要使用標頭檔，請確保它們是作為建置流程的一部分生成的。為此，請在 `build.gradle.kts` 檔案中加入以下條目：

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

首先，添加 `cinterops`，然後是定義檔的條目。預設情況下，使用檔案名稱。您可以透過額外參數來覆寫此設定：

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

現在您已擁有函式庫和對應的 Kotlin 存根 (stub)，可以在您的應用程式中使用它們。對於本教學，將 [simple.c](https://curl.se/libcurl/c/simple.html) 範例轉換為 Kotlin。

在 `src/nativeMain/kotlin/` 資料夾中，用以下程式碼更新您的 `Main.kt` 檔案：

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

如您所見，在 Kotlin 版本中，明確的變數宣告已被消除，但其他一切都與 C 版本大致相同。您在 `libcurl` 函式庫中預期的所有呼叫，都可以在 Kotlin 等效程式碼中找到。

> 這是逐行直譯。您也可以以更符合 Kotlin 習慣的方式編寫。
>
{type="tip"}

## 編譯並執行應用程式

1.  編譯應用程式。為此，從任務列表運行 `runDebugExecutableNative` Gradle 任務，或在終端機中使用以下命令：
 
    ```bash
    ./gradlew runDebugExecutableNative
    ```

    在本例中，由 `cinterop` 工具生成的部分會隱式包含在建置中。

2.  如果在編譯期間沒有錯誤，點擊 `main()` 函數旁邊裝訂線中的綠色 **Run** 圖示，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷鍵。

    IntelliJ IDEA 會開啟 **Run** 標籤並顯示輸出 — [example.com](https://example.com/) 的內容：

    ![Application output with HTML-code](native-output.png){width=700}

您可以看到實際輸出，因為 `curl_easy_perform` 呼叫會將結果列印到標準輸出。您可以使用 `curl_easy_setopt` 隱藏此內容。

> 您可以在我們的 [GitHub 儲存庫](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)中獲取完整的專案程式碼。
>
{style="note"}

## 下一步

了解更多關於 [Kotlin 與 C 的互通性](native-c-interop.md)。