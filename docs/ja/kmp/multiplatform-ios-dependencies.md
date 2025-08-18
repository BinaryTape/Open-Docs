[//]: # (title: iOS依存関係の追加)

Apple SDKの依存関係（FoundationやCore Bluetoothなど）は、Kotlin Multiplatformプロジェクトにおいて、ビルド済みライブラリのセットとして利用可能です。これらは追加の設定を必要としません。

また、iOSのソースセットでiOSエコシステム内の他のライブラリやフレームワークを再利用することもできます。Kotlinは、APIが`@objc`属性でObjective-Cにエクスポートされている場合、Objective-Cの依存関係やSwiftの依存関係との相互運用をサポートします。純粋なSwiftの依存関係はまだサポートされていません。

Kotlin MultiplatformプロジェクトでiOSの依存関係を処理するには、[cinteropツール](#with-cinterop)で管理するか、[CocoaPods依存関係マネージャー](#with-cocoapods)を使用できます（純粋なSwiftのPodはサポートされていません）。

### cinteropを使用する

cinteropツールを使用すると、Objective-CまたはSwiftの宣言に対してKotlinバインディングを作成できます。これにより、Kotlinコードからそれらを呼び出すことができるようになります。

[ライブラリ](#add-a-library)と[フレームワーク](#add-a-framework)では手順が多少異なりますが、一般的なワークフローは次のようになります。

1. 依存関係をダウンロードします。
2. バイナリを取得するためにビルドします。
3. この依存関係をcinteropに記述する特別な`.def` [定義ファイル](https://kotlinlang.org/docs/native-definition-file.html)を作成します。
4. ビルド中にバインディングを生成するようにビルドスクリプトを調整します。

#### ライブラリを追加する

1. ライブラリのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. ライブラリをビルドし（通常、ライブラリの作者がその方法に関するガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクト内に、例えば`DateTools.def`のような`.def`ファイルを作成します。
4. このファイルに最初の文字列を追加します: `language = Objective-C`。純粋なCの依存関係を使用したい場合は、languageプロパティを省略します。
5. 必須の2つのプロパティの値を指定します:

    * `headers` は、cinteropによって処理されるヘッダーを記述します。
    * `package` は、これらの宣言が配置されるパッケージの名前を設定します。

   例:

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. このライブラリとの相互運用に関する情報をビルドスクリプトに追加します:

    * `.def`ファイルへのパスを渡します。`.def`ファイルがcinteropと同じ名前で`src/nativeInterop/cinterop/`ディレクトリに配置されている場合、このパスは省略できます。
    * `includeDirs`オプションを使用して、cinteropにヘッダーファイルをどこで探すかを指示します。
    * ライブラリバイナリへのリンクを設定します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .defファイルへのパス
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // ヘッダー検索ディレクトリ（-I<path>コンパイラオプションのアナログ）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // ライブラリにリンクするために必要なリンカーオプション。
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .defファイルへのパス
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // ヘッダー検索ディレクトリ（-I<path>コンパイラオプションのアナログ）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // ライブラリにリンクするために必要なリンカーオプション。
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、この依存関係をKotlinコードで使用できます。そのためには、`.def`ファイルの`package`プロパティで設定したパッケージをインポートします。上記の例では次のようになります。

```kotlin
import DateTools.*
```

> cinteropツールとlibcurlライブラリを使用するサンプルプロジェクトを参照してください。
>
{style="tip"}

#### フレームワークを追加する

1. フレームワークのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. フレームワークをビルドし（通常、フレームワークの作者がその方法に関するガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクト内に、例えば`MyFramework.def`のような`.def`ファイルを作成します。
4. このファイルに最初の文字列を追加します: `language = Objective-C`。純粋なCの依存関係を使用したい場合は、languageプロパティを省略します。
5. これら2つの必須プロパティの値を指定します:

    * `modules` – cinteropによって処理されるフレームワークの名前。
    * `package` – これらの宣言が配置されるパッケージの名前。

    例:
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. フレームワークとの相互運用に関する情報をビルドスクリプトに追加します:

    * .defファイルへのパスを渡します。`.def`ファイルがcinteropと同じ名前で`src/nativeInterop/cinterop/`ディレクトリに配置されている場合、このパスは省略できます。
    * `-framework`オプションを使用してフレームワーク名をコンパイラとリンカーに渡します。`-F`オプションを使用してフレームワークのソースとバイナリへのパスをコンパイラとリンカーに渡します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .defファイルへのパス
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // リンカーにフレームワークの場所を指示する。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .defファイルへのパス
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // リンカーにフレームワークの場所を指示する。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、この依存関係をKotlinコードで使用できます。そのためには、`.def`ファイルのpackageプロパティで設定したパッケージをインポートします。上記の例では次のようになります。

```kotlin
import MyFramework.*
```

[Swift/Objective-Cの相互運用](https://kotlinlang.org/docs/native-objc-interop.html)と、[Gradleからのcinteropの設定](multiplatform-dsl-reference.md#cinterops)について詳しく学びましょう。

### CocoaPodsを使用する

1. [CocoaPods統合の初期設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)を行います。
2. 使用したいCocoaPodsリポジトリからのPodライブラリへの依存関係を、プロジェクトの`build.gradle(.kts)`に`pod()`関数呼び出しを含めることで追加します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
    <TabItem title="Groovy" group-key="groovy">

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

   Podライブラリに対して、以下の依存関係を追加できます:

   * [CocoaPodsリポジトリから](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [ローカルに保存されたライブラリを](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   * [カスタムGitリポジリから](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   * [カスタムPodspecリポジトリから](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [カスタムcinteropオプションで](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3. プロジェクトを再インポートするために、IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行します（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行します）。

Kotlinコードでこの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。上記の例では次のようになります:

```kotlin
import cocoapods.SDWebImage.*
```

> * Kotlinプロジェクトで異なるPod依存関係が設定されたサンプルプロジェクトを参照してください。
> * 複数のターゲットを持つXcodeプロジェクトがKotlinライブラリに依存するサンプルプロジェクトを確認してください。
> 
{style="tip"}

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースを確認し、以下について詳しく学びましょう:

* [プラットフォームライブラリの接続](https://kotlinlang.org/docs/native-platform-libs.html)
* [マルチプラットフォームライブラリまたは他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
* [Android依存関係の追加](multiplatform-android-dependencies.md)