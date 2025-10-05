[//]: # (title: Nativeサーバー)

<tldr>
<var name="example_name" value="embedded-server-native"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。
</link-summary>

Ktorは[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。現在、Kotlin/NativeでKtorサーバーを実行するには、以下の制限があります:
*   `embeddedServer`を使用して[サーバーを作成する](server-create-and-configure.topic)必要があります
*   [CIOエンジン](server-engines.md)のみがサポートされています
*   リバースプロキシなしの[HTTPS](server-ssl.md)はサポートされていません

## 依存関係を追加する {id="add-dependencies"}

Kotlin/NativeプロジェクトのKtorサーバーには、少なくとも2つの依存関係が必要です: `ktor-server-core`依存関係とエンジン依存関係（CIO）です。以下のコードスニペットは、`build.gradle.kts`ファイルの`nativeMain`ソースセットに依存関係を追加する方法を示しています:

```kotlin
}
sourceSets {
    val nativeMain by getting {
        dependencies {
            implementation("io.ktor:ktor-server-core:$ktor_version")
            implementation("io.ktor:ktor-server-cio:$ktor_version")
        }
    }
```

Nativeサーバーを[テスト](server-testing.md)するには、`ktor-server-test-host`アーティファクトを`nativeTest`ソースセットに追加します:

```kotlin
}
    }
    val nativeTest by getting {
        dependencies {
            implementation(kotlin("test"))
            implementation("io.ktor:ktor-server-test-host:$ktor_version")
        }
    }
```

## ネイティブターゲットを設定する {id="native-target"}

必要なネイティブターゲットを指定し、`binaries`プロパティを使用して[ネイティブバイナリを宣言](https://kotlinlang.org/docs/mpp-build-native-binaries.html)します:

```kotlin
    val arch = System.getProperty("os.arch")
    val nativeTarget = when {
        hostOs == "Mac OS X" && arch == "x86_64" -> macosX64("native")
        hostOs == "Mac OS X" && arch == "aarch64" -> macosArm64("native")
        hostOs == "Linux" && arch == "x86_64" -> linuxX64("native")
        hostOs == "Linux" && arch == "aarch64" -> linuxArm64("native")
        hostOs.startsWith("Windows") -> mingwX64("native")
        // Other supported targets are listed here: https://ktor.io/docs/server-native.html#targets
        else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
    }

    nativeTarget.apply {
        binaries {
            executable {
                entryPoint = "main"
            }
        }
```

完全な例は、こちらで確認できます: [embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## サーバーを作成する {id="create-server"}

Gradleビルドスクリプトを設定した後、こちらに記載されているようにKtorサーバーを作成できます: [サーバーを作成する](server-create-and-configure.topic)。