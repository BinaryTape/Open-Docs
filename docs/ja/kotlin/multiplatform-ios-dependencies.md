---
title: iOSの依存関係の追加
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Apple SDKの依存関係（FoundationやCore Bluetoothなど）は、Kotlin Multiplatformプロジェクトで事前構築済みのライブラリセットとして利用できます。追加の設定は必要ありません。

iOSエコシステムの他のライブラリやフレームワークをiOSソースセットで再利用することもできます。Kotlinは、Objective-Cの依存関係、およびSwiftの依存関係（それらのAPIが`@objc`属性でObjective-Cにエクスポートされている場合）との相互運用をサポートしています。Pure Swiftの依存関係はまだサポートされていません。

Kotlin MultiplatformプロジェクトでiOSの依存関係を処理するには、[cinteropツール](#with-cinterop)を使用するか、[CocoaPods dependency manager](#with-cocoapods)を使用します（pure Swift podsはサポートされていません）。

### With cinterop

cinteropツールを使用すると、Objective-CまたはSwiftの宣言に対するKotlinバインディングを作成できます。これにより、Kotlinコードからそれらを呼び出すことができます。

手順は[ライブラリ](#add-a-library)と[フレームワーク](#add-a-framework)で少し異なりますが、一般的なワークフローは次のようになります。

1. 依存関係をダウンロードします。
2. それをビルドして、そのバイナリを取得します。
3. cinteropにこの依存関係を記述する特別な`.def` [定義ファイル](native-definition-file)を作成します。
4. ビルド中にバインディングを生成するようにビルドスクリプトを調整します。

#### Add a library

1. ライブラリのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. ライブラリをビルドし（ライブラリの作成者は通常、これを行う方法のガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクトで、`.def`ファイルを作成します。たとえば、`DateTools.def`です。
4. このファイルに最初の文字列を追加します：`language = Objective-C`。Pure Cの依存関係を使用する場合は、languageプロパティを省略します。
5. 2つの必須プロパティの値を指定します。

    * `headers`は、cinteropによって処理されるヘッダーを記述します。
    * `package`は、これらの宣言を配置するパッケージの名前を設定します。

   例えば：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. このライブラリとの相互運用性に関する情報をビルドスクリプトに追加します。

    * `.def`ファイルへのパスを渡します。`.def`ファイルの名前がcinteropと同じで、`src/nativeInterop/cinterop/`ディレクトリに配置されている場合、このパスは省略できます。
    * `includeDirs`オプションを使用して、cinteropにヘッダーファイルを検索する場所を指示します。
    * ライブラリバイナリへのリンクを構成します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、Kotlinコードでこの依存関係を使用できます。これを行うには、`.def`ファイルの`package`プロパティで設定したパッケージをインポートします。上記の例では、これは次のようになります。

```kotlin
import DateTools.*
```

#### Add a framework

1. フレームワークのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. フレームワークをビルドし（フレームワークの作成者は通常、これを行う方法のガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクトで、`.def`ファイルを作成します。たとえば、`MyFramework.def`です。
4. このファイルに最初の文字列を追加します：`language = Objective-C`。Pure Cの依存関係を使用する場合は、languageプロパティを省略します。
5. 次の2つの必須プロパティの値を指定します。

    * `modules` – cinteropによって処理されるフレームワークの名前。
    * `package` – これらの宣言を配置するパッケージの名前。

    例えば：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. フレームワークとの相互運用性に関する情報をビルドスクリプトに追加します。

    * .defファイルへのパスを渡します。このパスは、.defファイルの名前がcinteropと同じで、`src/nativeInterop/cinterop/`ディレクトリに配置されている場合は省略できます。
    * `-framework`オプションを使用して、フレームワーク名をコンパイラーとリンカーに渡します。`-F`オプションを使用して、フレームワークのソースとバイナリへのパスをコンパイラーとリンカーに渡します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、Kotlinコードでこの依存関係を使用できます。これを行うには、packageプロパティの.defファイルで設定したパッケージをインポートします。上記の例では、これは次のようになります。

```kotlin
import MyFramework.*
```

[Objective-C and Swift interop](native-objc-interop)および[Gradleからのcinteropの設定](multiplatform-dsl-reference#cinterops)の詳細をご覧ください。

### With CocoaPods

1. [初期CocoaPods統合のセットアップ](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)を実行します。
2. プロジェクトの`build.gradle(.kts)`に`pod()`関数呼び出しを含めることにより、使用するCocoaPodsリポジトリからPodライブラリへの依存関係を追加します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs>

   Podライブラリに次の依存関係を追加できます。

   * [CocoaPodsリポジトリから](native-cocoapods-libraries#from-the-cocoapods-repository)
   * [ローカルに保存されたライブラリ上](native-cocoapods-libraries#on-a-locally-stored-library)
   * [カスタムGitリポジトリから](native-cocoapods-libraries#from-a-custom-git-repository)
   * [カスタムPodspecリポジトリから](native-cocoapods-libraries#from-a-custom-podspec-repository)
   * [カスタムcinteropオプション付き](native-cocoapods-libraries#with-custom-cinterop-options)

3. IntelliJ IDEAで**Reload All Gradle Projects**（またはAndroid Studioで**Sync Project with Gradle Files**）を実行して、プロジェクトを再インポートします。

Kotlinコードで依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。上記の例では、次のようになります。

```kotlin
import cocoapods.SDWebImage.*
```

## What's next?

マルチプラットフォームプロジェクトでの依存関係の追加に関するその他のリソースを確認し、詳細をご覧ください。

* [プラットフォームライブラリの接続](native-platform-libs)
* [マルチプラットフォームライブラリまたは他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies)
* [Androidの依存関係の追加](multiplatform-android-dependencies)