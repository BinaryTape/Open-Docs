[//]: # (title: iOS依存関係の追加)

Apple SDKの依存関係（FoundationやCore Bluetoothなど）は、Kotlin Multiplatformプロジェクトにおいて、プレビルド済みライブラリのセットとして利用可能です。これらに追加の設定は必要ありません。

iOSソースセットでは、他のiOSエコシステムのライブラリやフレームワークも再利用できます。Kotlinは、Objective-Cの依存関係や、APIが`@objc`属性でObjective-CにエクスポートされているSwiftの依存関係との相互運用性をサポートしています。純粋なSwiftの依存関係はまだサポートされていません。

Kotlin MultiplatformプロジェクトでiOSの依存関係を処理するには、[cinteropツール](#with-cinterop)で管理するか、[CocoaPods依存関係マネージャー](#with-cocoapods)を使用できます（純粋なSwift Podはサポートされていません）。

### cinteropを使用する場合

cinteropツールを使用して、Objective-CまたはSwiftの宣言に対するKotlinバインディングを作成できます。これにより、Kotlinコードからそれらを呼び出すことができるようになります。

手順は[ライブラリを追加する場合](#add-a-library)と[フレームワークを追加する場合](#add-a-framework)で少し異なりますが、一般的なワークフローは以下のようになります。

1.  依存関係をダウンロードします。
2.  バイナリを取得するためにビルドします。
3.  この依存関係をcinteropに記述する特殊な`.def`[定義ファイル](https://kotlinlang.org/docs/native-definition-file.html)を作成します。
4.  ビルド中にバインディングが生成されるようにビルドスクリプトを調整します。

#### ライブラリの追加

1.  ライブラリのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2.  ライブラリをビルドし（ライブラリの作成者は通常、その方法に関するガイドを提供しています）、バイナリへのパスを取得します。
3.  プロジェクト内に、例えば`DateTools.def`という`.def`ファイルを作成します。
4.  このファイルに最初の文字列として`language = Objective-C`を追加します。純粋なCの依存関係を使用したい場合は、`language`プロパティを省略します。
5.  2つの必須プロパティに値を指定します。

    *   `headers`は、cinteropによって処理されるヘッダーを記述します。
    *   `package`は、これらの宣言が配置されるべきパッケージの名前を設定します。

    例：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6.  このライブラリとの相互運用性に関する情報をビルドスクリプトに追加します。

    *   `.def`ファイルへのパスを渡します。`.def`ファイルがcinteropと同じ名前で`src/nativeInterop/cinterop/`ディレクトリに配置されている場合は、このパスを省略できます。
    *   `includeDirs`オプションを使用して、cinteropにヘッダーファイルをどこで探すかを伝えます。
    *   ライブラリのバイナリへのリンクを設定します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // Directories for header search (an analogue of the -I<path> compiler option)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // Directories for header search (an analogue of the -I<path> compiler option)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  プロジェクトをビルドします。

これで、この依存関係をKotlinコードで使用できるようになります。そのためには、`.def`ファイルで`package`プロパティに設定したパッケージをインポートします。上記の例では、次のようになります。

```kotlin
import DateTools.*
```

> [cinteropツールとlibcurlライブラリを使用するサンプルプロジェクト](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)を参照してください。
>
{style="tip"}

#### フレームワークの追加

1.  フレームワークのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2.  フレームワークをビルドし（フレームワークの作成者は通常、その方法に関するガイドを提供しています）、バイナリへのパスを取得します。
3.  プロジェクト内に、例えば`MyFramework.def`という`.def`ファイルを作成します。
4.  このファイルに最初の文字列として`language = Objective-C`を追加します。純粋なCの依存関係を使用したい場合は、`language`プロパティを省略します。
5.  これら2つの必須プロパティに値を指定します。

    *   `modules` – cinteropによって処理されるべきフレームワークの名前。
    *   `package` – これらの宣言が配置されるべきパッケージの名前。

    例：

    ```none
    modules = MyFramework
    package = MyFramework
    ```

6.  フレームワークとの相互運用性に関する情報をビルドスクリプトに追加します。

    *   `.def`ファイルへのパスを渡します。`.def`ファイルがcinteropと同じ名前で`src/nativeInterop/cinterop/`ディレクトリに配置されている場合は、このパスを省略できます。
    *   `-framework`オプションを使用して、フレームワーク名をコンパイラとリンカーに渡します。`-F`オプションを使用して、フレームワークのソースとバイナリへのパスをコンパイラとリンカーに渡します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  プロジェクトをビルドします。

これで、この依存関係をKotlinコードで使用できるようになります。そのためには、`.def`ファイルの`package`プロパティに設定したパッケージをインポートします。上記の例では、次のようになります。

```kotlin
import MyFramework.*
```

[Swift/Objective-Cの相互運用性](https://kotlinlang.org/docs/native-objc-interop.html)と[Gradleからのcinteropの設定](multiplatform-dsl-reference.md#cinterops)についてさらに学ぶことができます。

### CocoaPodsを使用する場合

1.  [CocoaPodsの初期統合設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)を実行します。
2.  プロジェクトの`build.gradle(.kts)`に`pod()`関数呼び出しを含めることで、使用したいCocoaPodsリポジトリからのPodライブラリへの依存関係を追加します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            //..
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            //..
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </tab>
    </tabs>

    Podライブラリには、以下の依存関係を追加できます。

    *   [CocoaPodsリポジトリから](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
    *   [ローカルに保存されたライブラリに対して](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
    *   [カスタムGitリポジトリから](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
    *   [カスタムPodspecリポジトリから](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
    *   [カスタムcinteropオプションを使用する](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3.  IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行するか（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）、プロジェクトを再インポートします。

Kotlinコードで依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。上記の例では、次のようになります。

```kotlin
import cocoapods.SDWebImage.*
```

> *   [Kotlinプロジェクトで異なるPod依存関係が設定されたサンプルプロジェクト](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)を参照してください。
> *   [複数のターゲットを持つXcodeプロジェクトがKotlinライブラリに依存するサンプルプロジェクト](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)を確認してください。
>
{style="tip"}

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースを確認し、以下についてさらに学びましょう。

*   [プラットフォームライブラリの接続](https://kotlinlang.org/docs/native-platform-libs.html)
*   [マルチプラットフォームライブラリまたは他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
*   [Androidの依存関係の追加](multiplatform-android-dependencies.md)