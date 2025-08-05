[//]: # (title: Kotlin/Native 函式庫)

## Kotlin 編譯器細節

若要使用 Kotlin/Native 編譯器產生函式庫，請使用 `-produce library` 或 `-p library` 旗標。例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此指令將會產生一個包含 `foo.kt` 編譯內容的 `bar.klib`。

若要連結至函式庫，請使用 `-library <name>` 或 `-l <name>` 旗標。例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此指令將會從 `qux.kt` 和 `bar.klib` 產生一個 `program.kexe`。

## cinterop 工具細節

**cinterop** 工具會產生用於原生函式庫的 `.klib` 包裝器 (wrapper) 作為其主要輸出。
例如，使用您的 Kotlin/Native 發行版中提供的簡單 `libgit2.def` 原生函式庫定義檔

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我們將會取得 `libgit2.klib`。

請參閱 [C 互通操作性](native-c-interop.md) 以了解更多詳細資訊。

## klib 工具程式

**klib** 函式庫管理工具程式允許您檢查並安裝函式庫。

以下指令可用：

*   `content` – 列出函式庫內容：

    ```bash
    $ klib contents <name>
    ```

*   `info` – 檢查函式庫的帳務詳細資訊

    ```bash
    $ klib info <name>
    ```

*   `install` – 將函式庫安裝至預設位置

    ```bash
    $ klib install <name>
    ```

*   `remove` – 從預設儲存庫移除函式庫

    ```bash
    $ klib remove <name>
    ```

以上所有指令都接受一個額外的 `-repository <directory>` 引數，用於指定不同於預設儲存庫的儲存庫。

```bash
$ klib <command> <name> -repository <directory>
```

## 幾個範例

首先，讓我們建立一個函式庫。
將這個小型的函式庫原始碼放入 `kotlinizer.kt` 中：

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

函式庫已在目前目錄中建立：

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

現在，讓我們檢查函式庫的內容：

```bash
$ klib contents kotlinizer
```

您可以將 `kotlinizer` 安裝至預設儲存庫：

```bash
$ klib install kotlinizer
```

從目前目錄中移除其所有蹤跡：

```bash
$ rm kotlinizer.klib
```

建立一個非常簡短的程式並將其放入 `use.kt` 中：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

現在，編譯此程式並連結您剛剛建立的函式庫：

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

並執行此程式：

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

玩得開心！

## 進階主題

### 函式庫搜尋順序

當給予 `-library foo` 旗標時，編譯器會依照以下順序搜尋 `foo` 函式庫：

*   目前的編譯目錄或絕對路徑。
*   所有使用 `-repo` 旗標指定的儲存庫。
*   安裝在預設儲存庫中的函式庫。

   > 預設儲存庫是 `~/.konan`。您可以透過設定 `kotlin.data.dir` Gradle 屬性來更改它。
   > 
   > 或者，您可以透過 `cinterop` 和 `konanc` 工具使用 `-Xkonan-data-dir` 編譯器選項來設定自訂的目錄路徑。
   > 
   {style="note"}

*   安裝在 `$installation/klib` 目錄中的函式庫。

### 函式庫格式

Kotlin/Native 函式庫是 zip 檔案，其中包含預先定義的目錄結構，佈局如下：

當 `foo.klib` 解壓縮為 `foo/` 時，會得到：

```text
  - foo/
    - $component_name/
      - ir/
        - 序列化的 Kotlin IR。
      - targets/
        - $platform/
          - kotlin/
            - 編譯為 LLVM 位元碼的 Kotlin。
          - native/
            - 額外原生物件的位元碼檔案。
        - $another_platform/
          - 可以有多個平台特定的 Kotlin 和原生配對。
      - linkdata/
        - 一組包含序列化連結中繼資料的 ProtoBuf 檔案。
      - resources/
        - 一般資源，例如影像。(尚未啟用)。
      - manifest - 一個以 Java 屬性格式描述函式庫的檔案。
```

範例佈局可在您的安裝目錄 `klib/stdlib` 中找到。

### 在 klib 中使用相對路徑

> 從 Kotlin 1.6.20 版本起，在 klib 中使用相對路徑的功能已可用。
> 
{style="note"}

原始檔的序列化 IR 表示是 `klib` 函式庫的[一部分](#library-format)。它包含用於產生正確偵錯資訊的檔案路徑。預設情況下，儲存的路徑是絕對路徑。
透過 `-Xklib-relative-path-base` 編譯器選項，您可以更改格式並僅在構件中使用相對路徑。為了使其運作，請傳遞一個或多個原始檔的基礎路徑作為引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是原始檔的基礎路徑
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base 是原始檔的基礎路徑
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>