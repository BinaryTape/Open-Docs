[//]: # (title: コンピレーションを構成する)

Kotlinマルチプラットフォームプロジェクトは、アーティファクトを生成するためにコンピレーションを使用します。各ターゲットには、たとえば製品用とテスト用など、1つ以上のコンピレーションを含めることができます。

各ターゲットには、デフォルトのコンピレーションとして以下が含まれます。

*   JVM、JS、およびNativeターゲットの`main`および`test`コンピレーション。
*   Androidターゲットの場合、[Androidビルドバリアント](https://developer.android.com/build/build-variants)ごとの[コンピレーション](#compilation-for-android)。

![Compilations](compilations.svg)

製品コードと単体テスト以外のものをコンパイルする必要がある場合、たとえば結合テストやパフォーマンステストの場合は、[カスタムコンピレーションを作成](#create-a-custom-compilation)できます。

アーティファクトがどのように生成されるかを以下で構成できます。

*   プロジェクト内の[すべてのコンピレーション](#configure-all-compilations)を一括で構成する。
*   1つのターゲットが複数のコンピレーションを持つことができるため、[1つのターゲットのコンピレーション](#configure-compilations-for-one-target)を構成する。
*   [特定のコンピレーション](#configure-one-compilation)を構成する。

すべてのターゲットまたは特定のターゲットで利用可能な[コンピレーションパラメータのリスト](multiplatform-dsl-reference.md#compilation-parameters)と[コンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)を参照してください。

## すべてのコンピレーションを構成する

この例では、すべてのターゲットに共通するコンパイラオプションを構成します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 1つのターゲットのコンピレーションを構成する

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</TabItem>
</Tabs>

## 1つのコンピレーションを構成する

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## カスタムコンピレーションを作成する

製品コードと単体テスト以外のものをコンパイルする必要がある場合、たとえば結合テストやパフォーマンステストの場合は、カスタムコンピレーションを作成します。

カスタムコンピレーションの場合、すべての依存関係を手動で設定する必要があります。カスタムコンピレーションのデフォルトソースセットは、`commonMain`および`commonTest`ソースセットに依存しません。

たとえば、`jvm`ターゲットの結合テスト用のカスタムコンピレーションを作成するには、`integrationTest`コンピレーションと`main`コンピレーションの間に[`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks)リレーションを設定します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

コンピレーションを関連付けることで、メインコンピレーションの出力を依存関係として追加し、コンピレーション間の`internal`可視性を確立します。

カスタムコンピレーションは他のケースでも必要です。たとえば、最終的なアーティファクトで異なるJVMバージョンのコンピレーションを結合したい場合や、すでにGradleでソースセットを設定していてマルチプラットフォームプロジェクトに移行したい場合などです。

> [`androidTarget`](#compilation-for-android)のカスタムコンピレーションを作成するには、[Android Gradleプラグイン](https://developer.android.com/build/build-variants)を通じてビルドバリアントを設定してください。
> 
{style="tip"}

## JVMのコンピレーション

マルチプラットフォームプロジェクトで`jvm`ターゲットを宣言すると、Kotlin Multiplatformプラグインは自動的にJavaソースセットを作成し、それらをJVMターゲットのコンピレーションに含めます。

共通ソースセットにはJavaリソースを含めることができないため、それらをマルチプラットフォームプロジェクトの対応する子ディレクトリに配置する必要があります。たとえば：

![Java source files](java-source-paths.png){width=200}

現在、Kotlin MultiplatformプラグインはJavaプラグインによって構成される一部のタスクを置き換えます。

*   JARタスク：標準の`jar`の代わりに、アーティファクト名に基づくターゲット固有のタスクを使用します。たとえば、`jvm()`ターゲット宣言の場合は`jvmJar`、`jvm("desktop")`の場合は`desktopJar`です。
*   テストタスク：標準の`test`の代わりに、アーティファクト名に基づくターゲット固有のタスクを使用します。たとえば、`jvmTest`です。
*   リソース処理：`*ProcessResources`タスクの代わりに、リソースは対応するコンピレーションタスクによって処理されます。

これらのタスクは、ターゲットが宣言されると自動的に作成されます。ただし、必要に応じてJARタスクを手動で定義し、構成することができます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

このターゲットはKotlin Multiplatformプラグインによって公開され、Javaプラグインに固有の手順は必要ありません。

## ネイティブ言語との相互運用性を構成する

Kotlinは[ネイティブ言語との相互運用性](https://kotlinlang.org/docs/native-overview.html)を提供し、特定のコンピレーションのためにこれを構成するDSLを提供します。

| ネイティブ言語       | サポートされているプラットフォーム               | コメント                                                               |
|:-------------------|:-----------------------------------------------|:-----------------------------------------------------------------------|
| C                  | すべてのプラットフォーム                       |                                                                        |
| Objective-C        | Appleプラットフォーム (macOS, iOS, watchOS, tvOS) |                                                                        |
| Swift via Objective-C | Appleプラットフォーム (macOS, iOS, watchOS, tvOS) | Kotlinは`@objc`属性でマークされたSwift宣言のみを使用できます。 |

コンピレーションは複数のネイティブライブラリと対話できます。ビルドファイルの[定義ファイル](https://kotlinlang.org/docs/native-definition-file.html)または[`cinterops`ブロック](multiplatform-dsl-reference.md#cinterops)で利用可能なプロパティを使用して相互運用性を構成します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // ネイティブAPIを記述するDef-file。
                // デフォルトのパスはsrc/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // 生成されたKotlin APIを配置するパッケージ。
                packageName("org.sample")
                
                // cinteropツールによってコンパイラに渡されるオプション。
                compilerOpts("-Ipath/to/headers")
              
                // ヘッダーを検索するディレクトリ。
                includeDirs.apply {
                    // ヘッダー検索用のディレクトリ（-I<path>コンパイラオプションと同等）。
                    allHeaders("path1", "path2")
                    
                    // 'headerFilter' def-fileオプションにリストされているヘッダーを検索する追加ディレクトリ。
                    // -headerFilterAdditionalSearchPrefixコマンドラインオプションと同等。
                    headerFilterOnly("path1", "path2")
                }
                // includeDirs.allHeadersのショートカット。
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // ネイティブAPIを記述するDef-file。
                    // デフォルトのパスはsrc/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // 生成されたKotlin APIを配置するパッケージ。
                    packageName 'org.sample'
                    
                    // cinteropツールによってコンパイラに渡されるオプション。
                    compilerOpts '-Ipath/to/headers'
                    
                    // ヘッダー検索用のディレクトリ（-I<path>コンパイラオプションと同等）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 'headerFilter' def-fileオプションにリストされているヘッダーを検索する追加ディレクトリ。
                    // -headerFilterAdditionalSearchPrefixコマンドラインオプションと同等。
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // includeDirs.allHeadersのショートカット。
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Androidのコンピレーション

Androidターゲット用にデフォルトで作成されるコンピレーションは、[Androidビルドバリアント](https://developer.android.com/build/build-variants)に結び付けられています。各ビルドバリアントに対して、同じ名前のKotlinコンピレーションが作成されます。

次に、各バリアント用にコンパイルされる各[Androidソースセット](https://developer.android.com/build/build-variants#sourcesets)に対して、そのソースセット名にターゲット名がプレフィックスとして付けられたKotlinソースセットが作成されます。たとえば、Androidソースセット`debug`と`androidTarget`という名前のKotlinターゲットの場合、Kotlinソースセットは`androidDebug`となります。これらのKotlinソースセットは、バリアントのコンピレーションに適切に追加されます。

デフォルトのソースセット`commonMain`は、各本番（アプリケーションまたはライブラリ）バリアントのコンピレーションに追加されます。`commonTest`ソースセットも同様に、単体テストおよび計装テストバリアントのコンピレーションに追加されます。

[`kapt`](https://kotlinlang.org/docs/kapt.html)によるアノテーション処理もサポートされていますが、現在の制限により、Androidターゲットが`kapt`の依存関係が構成される前に作成されている必要があり、これはKotlinソースセットの依存関係内ではなく、トップレベルの`dependencies {}`ブロックで行う必要があります。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## ソースセット階層のコンピレーション

Kotlinは`dependsOn`関係を使用して[ソースセット階層](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)を構築できます。

![Source set hierarchy](jvm-js-main.svg)

ソースセット`jvmMain`がソースセット`commonMain`に依存している場合：

*   `jvmMain`が特定のターゲット用にコンパイルされるたびに、`commonMain`もそのコンピレーションに参加し、JVMクラスファイルなどの同じターゲットバイナリ形式にコンパイルされます。
*   `jvmMain`のソースは、`commonMain`の宣言（内部宣言を含む）を「参照」し、`commonMain`の[依存関係](multiplatform-add-dependencies.md)（`implementation`依存関係として指定されたものも含む）も参照します。
*   `jvmMain`は、`commonMain`の[期待される宣言](multiplatform-expect-actual.md)に対してプラットフォーム固有の実装を含めることができます。
*   `commonMain`のリソースは常に処理され、`jvmMain`のリソースとともにコピーされます。
*   `jvmMain`と`commonMain`の[言語設定](multiplatform-dsl-reference.md#language-settings)は一貫している必要があります。

言語設定は、次のような方法で一貫性がチェックされます。
*   `jvmMain`は、`commonMain`の`languageVersion`以上である`languageVersion`を設定する必要があります。
*   `jvmMain`は、`commonMain`が有効にしているすべての不安定な言語機能を有効にする必要があります（バグ修正機能にはそのような要件はありません）。
*   `jvmMain`は、`commonMain`が使用するすべての実験的アノテーションを使用する必要があります。
*   `apiVersion`、バグ修正言語機能、および`progressiveMode`は任意に設定できます。

## GradleのIsolated Projects機能を構成する

> この機能は[実験的](supported-platforms.md#general-kotlin-stability-levels)であり、現在Gradleではプレアルファ状態にあります。Gradle 8.10以降のバージョンでのみ、評価目的でご利用ください。この機能は、いつでも削除または変更される可能性があります。この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でお待ちしております。オプトインが必要です（詳細は下記参照）。
> 
{style="warning"}

Gradleは[Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)機能を提供しており、個々のプロジェクトを「分離」することでビルドパフォーマンスを向上させます。この機能は、プロジェクト間でビルドスクリプトとプラグインを分離し、並行して安全に実行できるようにします。

この機能を有効にするには、Gradleの指示に従って[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)してください。

Isolated Projects機能の詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/isolated_projects.html)を参照してください。