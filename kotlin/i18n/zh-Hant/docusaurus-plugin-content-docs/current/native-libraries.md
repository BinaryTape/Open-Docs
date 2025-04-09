---
title: "Kotlin/Native 函式庫"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Kotlin 編譯器細節

要使用 Kotlin/Native 編譯器產生一個函式庫，請使用 `-produce library` 或 `-p library` 標記。 例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此命令將會產生一個 `bar.klib`，其中包含 `foo.kt` 的已編譯內容。

要連結到一個函式庫，請使用 `-library <name>` 或 `-l <name>` 標記。 例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此命令將會由 `qux.kt` 和 `bar.klib` 產生一個 `program.kexe`。

## cinterop 工具細節

**cinterop** 工具會為原生函式庫產生 `.klib` 包裝函式作為其主要輸出。
例如，使用您的 Kotlin/Native 發行版中提供的簡單 `libgit2.def` 原生函式庫定義檔

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我們將會獲得 `libgit2.klib`。

請參閱 [C Interop](native-c-interop) 以取得更多詳細資訊。

## klib 實用工具

**klib** 函式庫管理實用工具可讓您檢查和安裝函式庫。

以下指令可用：

* `content` – 列出函式庫內容：

  ```bash
  $ klib contents <name>
  ```

* `info` – 檢查函式庫的簿記詳細資訊

  ```bash
  $ klib info <name>
  ```

* `install` – 將函式庫安裝到預設位置使用

  ```bash
  $ klib install <name>
  ```

* `remove` – 從預設儲存庫移除函式庫使用

  ```bash
  $ klib remove <name>
  ```

以上所有指令都接受額外的 `-repository <directory>` 引數，用於指定與預設儲存庫不同的儲存庫。

```bash
$ klib <command> <name> -repository <directory>
```

## 幾個範例

首先，讓我們建立一個函式庫。
將微小的函式庫原始碼放入 `kotlinizer.kt`：

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

現在讓我們檢查函式庫的內容：

```bash
$ klib contents kotlinizer
```

您可以將 `kotlinizer` 安裝到預設儲存庫：

```bash
$ klib install kotlinizer
```

從目前目錄中移除它的任何蹤跡：

```bash
$ rm kotlinizer.klib
```

建立一個非常短的程式並將其放入 `use.kt` 中：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

現在編譯程式，並連結您剛建立的函式庫：

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

然後執行程式：

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

玩得開心！

## 進階主題

### 函式庫搜尋順序

當給定 `-library foo` 標記時，編譯器會依以下順序搜尋 `foo` 函式庫：

* 目前編譯目錄或絕對路徑。
* 所有以 `-repo` 標記指定的儲存庫。
* 安裝在預設儲存庫中的函式庫。

   > 預設儲存庫是 `~/.konan`。 您可以透過設定 `kotlin.data.dir` Gradle 屬性來變更它。
   > 
   > 或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具來配置您自訂的路徑到目錄。
   > 
   

* 安裝在 `$installation/klib` 目錄中的函式庫。

### 函式庫格式

Kotlin/Native 函式庫是包含預定義目錄結構的 zip 檔案，具有以下版面配置：

當解壓縮為 `foo/` 時，`foo.klib` 給我們：

```text
  - foo/
    - $component_name/
      - ir/
        - Serialized Kotlin IR.
      - targets/
        - $platform/
          - kotlin/
            - Kotlin compiled to LLVM bitcode.
          - native/
            - Bitcode files of additional native objects.
        - $another_platform/
          - There can be several platform specific kotlin and native pairs.
      - linkdata/
        - A set of ProtoBuf files with serialized linkage metadata.
      - resources/
        - General resources such as images. (Not used yet).
      - manifest - A file in the java property format describing the library.
```

您可以在安裝目錄的 `klib/stdlib` 目錄中找到範例版面配置。

### 在 klib 中使用相對路徑

:::note
自 Kotlin 1.6.20 起，klib 中已可使用相對路徑。

:::

原始檔的序列化 IR 表示是 `klib` 函式庫的 [一部分](#library-format)。 它包含用於產生正確偵錯資訊的檔案路徑。 預設情況下，儲存的路徑是絕對路徑。 使用 `-Xklib-relative-path-base` 編譯器選項，您可以變更格式並僅在成品中使用相對路徑。 為了使其正常運作，請將原始檔的一個或多個基本路徑作為引數傳遞：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base is a base path of source files
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base is a base path of source files
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</TabItem>
</Tabs>