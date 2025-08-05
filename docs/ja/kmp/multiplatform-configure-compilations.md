[//]: # (title: コンパイル設定)

Kotlinマルチプラットフォームプロジェクトでは、成果物を生成するためにコンパイルを利用します。各ターゲットは、たとえばプロダクション用やテスト用など、1つ以上のコンパイルを持つことができます。

各ターゲットには、デフォルトのコンパイルとして以下が含まれます。

*   JVM、JS、およびNativeターゲットの`main`コンパイルと`test`コンパイル。
*   Androidターゲットの場合は、[Androidのビルドバリアント](https://developer.android.com/build/build-variants)ごとに1つの[コンパイル](#compilation-for-android)。

![Compilations](compilations.svg)

プロダクションコードや単体テスト以外のもの（たとえば、統合テストやパフォーマンステストなど）をコンパイルする必要がある場合は、[カスタムコンパイルを作成](#create-a-custom-compilation)できます。

成果物がどのように生成されるかを以下の場所で設定できます。

*   プロジェクト内の[すべてのコンパイル](#configure-all-compilations)を一括で。
*   1つのターゲットが複数のコンパイルを持つことができるため、[単一ターゲットのコンパイル](#configure-compilations-for-one-target)で。
*   [特定のコンパイル](#configure-one-compilation)で。

すべてのターゲットまたは特定のターゲットで利用できる[コンパイルパラメータのリスト](multiplatform-dsl-reference.md#compilation-parameters)と[コンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)を参照してください。

## すべてのコンパイルを設定する

この例では、すべてのターゲットに共通のコンパイラオプションを設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 単一ターゲットのコンパイルを設定する

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</tab>
</tabs>

## 単一のコンパイルを設定する

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }
    }
}
```

</tab>
</tabs>

## カスタムコンパイルを作成する

プロダクションコードや単体テスト以外のもの（たとえば、統合テストやパフォーマンステストなど）をコンパイルする必要がある場合は、カスタムコンパイルを作成します。

カスタムコンパイルの場合、すべての依存関係を手動で設定する必要があります。カスタムコンパイルのデフォルトソースセットは、`commonMain`および`commonTest`ソースセットには依存しません。

たとえば、`jvm`ターゲットの統合テスト用のカスタムコンパイルを作成するには、`integrationTest`コンパイルと`main`コンパイルの間に[`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks)リレーションを設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // Import main and its classpath as dependencies and establish internal visibility
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                testRuns.create("integration") {
                    // Configure the test task
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // Import main and its classpath as dependencies and establish internal visibility
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // Create a test task to run the tests produced by this compilation
            testRuns.create('integration') {
                // Configure the test task
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

コンパイルを関連付けることで、メインコンパイルの出力を依存関係として追加し、コンパイル間に`internal`の可視性を確立します。

カスタムコンパイルは他のケースでも必要です。たとえば、最終成果物で異なるJVMバージョンのコンパイルを組み合わせたい場合や、Gradleですでにソースセットを設定しておりマルチプラットフォームプロジェクトに移行したい場合などです。

> [`androidTarget`](#compilation-for-android)のカスタムコンパイルを作成するには、[Android Gradleプラグイン](https://developer.android.com/build/build-variants)を介してビルドバリアントを設定します。
> 
{style="tip"}

## JVM向けコンパイル

マルチプラットフォームプロジェクトで`jvm`ターゲットを宣言すると、Kotlin Multiplatformプラグインは自動的にJavaソースセットを作成し、それらをJVMターゲットのコンパイルに含めます。

共通ソースセットはJavaリソースを含めることができないため、それらをマルチプラットフォームプロジェクトの対応する子ディレクトリに配置する必要があります。例：

![Java source files](java-source-paths.png){width=200}

現在、Kotlin MultiplatformプラグインはJavaプラグインによって設定されたいくつかのタスクを置き換えます。

*   JARタスク：標準の`jar`の代わりに、成果物の名前に基づくターゲット固有のタスクを使用します。たとえば、`jvm()`ターゲット宣言の場合は`jvmJar`、`jvm("desktop")`の場合は`desktopJar`です。
*   Testタスク：標準の`test`の代わりに、成果物の名前に基づくターゲット固有のタスクを使用します。たとえば、`jvmTest`です。
*   リソース処理：`*ProcessResources`タスクの代わりに、リソースは対応するコンパイルタスクによって処理されます。

これらのタスクは、ターゲットが宣言されると自動的に作成されます。ただし、必要に応じてJARタスクを手動で定義し、設定することができます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Shared module's `build.gradle.kts` file
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Shared module's `build.gradle` file
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</tab>
</tabs>

このターゲットはKotlin Multiplatformプラグインによって公開され、Javaプラグインに特有のステップは必要ありません。

## ネイティブ言語との相互運用性を設定する

Kotlinは[ネイティブ言語との相互運用性](https://kotlinlang.org/docs/native-overview.html)を提供しており、特定のコンパイル用にこれを設定するためのDSLも提供しています。

| ネイティブ言語       | サポートされているプラットフォーム                  | コメント                                                            |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------|
| C                     | すべてのプラットフォーム                      |                                                                     |
| Objective-C           | Appleプラットフォーム (macOS, iOS, watchOS, tvOS) |                                                                     |
| Swift via Objective-C | Appleプラットフォーム (macOS, iOS, watchOS, tvOS) | Kotlinは`@objc`属性でマークされたSwiftの宣言のみを使用できます。     |

コンパイルは複数のネイティブライブラリと対話できます。ビルドファイルの[定義ファイル](https://kotlinlang.org/docs/native-definition-file.html)または[`cinterops`ブロック](multiplatform-dsl-reference.md#cinterops)にある利用可能なプロパティで相互運用性を設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // Package to place the Kotlin API generated.
                packageName("org.sample")
                
                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")
              
                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'
                    
                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'
                    
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // A shortcut for includeDirs.allHeaders.
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

## Android向けコンパイル

Androidターゲット用にデフォルトで作成されるコンパイルは、[Androidビルドバリアント](https://developer.android.com/build/build-variants)に紐付けられています。各ビルドバリアントに対して、同じ名前のKotlinコンパイルが作成されます。

次に、各バリアント用にコンパイルされる各[Androidソースセット](https://developer.android.com/build/build-variants#sourcesets)に対し、Kotlinソースセットがターゲット名を先頭に付けて作成されます。たとえば、Androidソースセット`debug`と`androidTarget`という名前のKotlinターゲットの場合、Kotlinソースセットは`androidDebug`となります。これらのKotlinソースセットは、それに応じてバリアントのコンパイルに追加されます。

デフォルトのソースセット`commonMain`は、各プロダクション（アプリケーションまたはライブラリ）バリアントのコンパイルに追加されます。`commonTest`ソースセットも同様に、単体テストおよびインストゥルメンテッドテストバリアントのコンパイルに追加されます。

[`kapt`](https://kotlinlang.org/docs/kapt.html)を使用したアノテーション処理もサポートされていますが、現在の制限により、`kapt`の依存関係が設定される前にAndroidターゲットが作成されている必要があります。これは、Kotlinソースセットの依存関係内ではなく、トップレベルの`dependencies {}`ブロックで行う必要があります。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## ソースセット階層のコンパイル

Kotlinは`dependsOn`関係を使用して[ソースセット階層](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)を構築できます。

![Source set hierarchy](jvm-js-main.svg)

ソースセット`jvmMain`がソースセット`commonMain`に依存している場合：

*   `jvmMain`が特定のターゲット向けにコンパイルされるときはいつでも、`commonMain`もそのコンパイルに参加し、JVMクラスファイルのような同じターゲットバイナリ形式にコンパイルされます。
*   `jvmMain`のソースは、`commonMain`の宣言（内部宣言を含む）を「参照」でき、`commonMain`の[依存関係](multiplatform-add-dependencies.md)（`implementation`依存関係として指定されたものも含む）も参照できます。
*   `jvmMain`は、`commonMain`の[期待される宣言](multiplatform-expect-actual.md)に対してプラットフォーム固有の実装を含めることができます。
*   `commonMain`のリソースは常に、`jvmMain`のリソースとともに処理され、コピーされます。
*   `jvmMain`と`commonMain`の[言語設定](multiplatform-dsl-reference.md#language-settings)は一貫している必要があります。

言語設定は、次のように一貫性がチェックされます。
*   `jvmMain`は、`commonMain`の`languageVersion`以上である`languageVersion`を設定する必要があります。
*   `jvmMain`は、`commonMain`が有効にしているすべての不安定な言語機能を有効にする必要があります（バグ修正機能にはこのような要件はありません）。
*   `jvmMain`は、`commonMain`が使用するすべての実験的なアノテーションを使用する必要があります。
*   `apiVersion`、バグ修正言語機能、および`progressiveMode`は任意に設定できます。

## GradleのIsolated Projects機能を設定する

> この機能は[実験的](supported-platforms.md#general-kotlin-stability-levels)であり、現在Gradleではプレアルファ段階です。Gradle 8.10以降のバージョンでのみ、評価目的でご使用ください。この機能は、いつでも廃止または変更される可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でのフィードバックをお待ちしております。オプトインが必要です（詳細は下記参照）。
> 
{style="warning"}

Gradleは[Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)機能を提供しており、個々のプロジェクトを「分離」することでビルドパフォーマンスを向上させます。この機能は、ビルドスクリプトとプラグインをプロジェクト間で分離し、安全に並行して実行できるようにします。

この機能を有効にするには、Gradleの指示に従って[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)してください。

Isolated Projects機能の詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/isolated_projects.html)を参照してください。