---
title: コンパイルの設定
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlinマルチプラットフォームプロジェクトでは、成果物を作成するためにコンピレーションを使用します。各ターゲットは、例えば本番用やテスト用など、1つまたは複数のコンピレーションを持つことができます。

各ターゲットのデフォルトのコンピレーションは次のとおりです。

* JVM、JS、およびNativeターゲットの`main`および`test`コンピレーション。
* Androidターゲットの場合、[Androidビルドバリアント](https://developer.android.com/studio/build/build-variants)ごとの[コンピレーション](#compilation-for-android)。

<img src="/img/compilations.svg" alt="コンピレーション" style={{verticalAlign: 'middle'}}/>

本番コードやユニットテスト以外のもの（例えば、インテグレーションテストやパフォーマンステスト）をコンパイルする必要がある場合は、[カスタムコンピレーションを作成](#create-a-custom-compilation)できます。

成果物がどのように生成されるかは、以下で設定できます。

* プロジェクト内の[すべてのコンピレーションを一度に設定](#configure-all-compilations)する。
* 1つのターゲットに複数のコンピレーションが存在しうるため、[1つのターゲットに対するコンピレーションを設定](#configure-compilations-for-one-target)する。
* [特定のコンピレーションを設定](#configure-one-compilation)する。

[コンピレーションパラメーターの一覧](multiplatform-dsl-reference#compilation-parameters)と、すべてまたは特定のターゲットで使用可能な[コンパイラーオプション](gradle-compiler-options)を参照してください。

## すべてのコンピレーションを設定する

この例では、すべてのターゲットに共通のコンパイラーオプションを設定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 1つのターゲットに対するコンピレーションを設定する

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

## 特定のコンピレーションを設定する

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

本番コードやユニットテスト以外のもの（例えば、インテグレーションテストやパフォーマンステスト）をコンパイルする必要がある場合は、カスタムコンピレーションを作成します。
 
例えば、`jvm()`ターゲットのインテグレーションテスト用のカスタムコンピレーションを作成するには、`compilations`コレクションに新しい項目を追加します。
 
:::note
カスタムコンピレーションの場合、すべての依存関係を手動で設定する必要があります。カスタムコンピレーションのデフォルトのソースセットは、`commonMain`および`commonTest`ソースセットに依存しません。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting
            
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                tasks.register<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                    
                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
           
            // Create a test task to run the tests produced by this compilation:
            tasks.register('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                
                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</TabItem>
</Tabs>

例えば、最終的な成果物で異なるJVMバージョン用のコンピレーションを結合する場合や、Gradleでソースセットを既に設定しており、マルチプラットフォームプロジェクトに移行したい場合など、他のケースでもカスタムコンピレーションを作成する必要があります。

## JVMコンピレーションでJavaソースを使用する

[プロジェクトウィザード](https://kmp.jetbrains.com/)でプロジェクトを作成すると、Javaソースがデフォルトで作成され、JVMターゲットのコンピレーションに含まれます。

Javaソースファイルは、Kotlinソースルートの子ディレクトリに配置されます。例えば、パスは次のとおりです。

<img src="/img/java-source-paths.png" alt="Java source files" width="200" style={{verticalAlign: 'middle'}}/>

共通ソースセットには、Javaソースを含めることはできません。

現在の制限により、KotlinプラグインはJavaプラグインによって構成されたいくつかのタスクを置き換えます。

* `jar`の代わりにターゲットのJARタスク（例えば、`jvmJar`）。
* `test`の代わりにターゲットのテストタスク（例えば、`jvmTest`）。
* リソースは、`*ProcessResources`タスクの代わりに、コンピレーションの同等のタスクによって処理されます。

このターゲットの公開はKotlinプラグインによって処理され、Javaプラグインに固有の手順は必要ありません。

## ネイティブ言語との相互運用を設定する

Kotlinは[ネイティブ言語との相互運用性](native-c-interop)と、特定のコンピレーションのためにこれを設定するDSLを提供します。

| ネイティブ言語       | サポートされているプラットフォーム                         | コメント                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | すべてのプラットフォーム（WebAssemblyを除く）       |                                                                           |
| Objective-C           | Appleプラットフォーム（macOS、iOS、watchOS、tvOS） |                                                                           |
| Objective-C経由のSwift | Appleプラットフォーム（macOS、iOS、watchOS、tvOS） | Kotlinは`@objc`属性でマークされたSwift宣言のみを使用できます。 |

1つのコンピレーションは、複数のネイティブライブラリと相互作用できます。[定義ファイル](native-definition-file)またはビルドファイルの[`cinterops`ブロック](multiplatform-dsl-reference#cinterops)で使用可能なプロパティを使用して、相互運用性を設定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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
                    
                    // Directories for header search (an eqivalent of the -I<path> compiler option).
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

</TabItem>
</Tabs>

## Androidのコンピレーション
 
デフォルトでAndroidターゲット用に作成されるコンピレーションは、[Androidビルドバリアント](https://developer.android.com/studio/build/build-variants)に関連付けられています。
各ビルドバリアントに対して、同じ名前でKotlinコンピレーションが作成されます。

次に、各バリアントに対してコンパイルされる各[Androidソースセット](https://developer.android.com/studio/build/build-variants#sourcesets)に対して、Kotlinソースセットがそのソースセット名にターゲット名が付加された名前で作成されます。例えば、Androidソースセット`debug`と`androidTarget`という名前のKotlinターゲットの場合、Kotlinソースセット`androidDebug`です。これらのKotlinソースセットは、バリアントのコンピレーションに適切に追加されます。

デフォルトのソースセット`commonMain`は、各本番（アプリケーションまたはライブラリ）バリアントのコンピレーションに追加されます。
同様に、`commonTest`ソースセットは、ユニットテストおよびインストルメンテーションテストバリアントのコンピレーションに追加されます。

[`kapt`](kapt)によるアノテーション処理もサポートされていますが、現在の制限により、Androidターゲットは`kapt`依存関係が設定される前に作成する必要があり、Kotlinソースセットの依存関係内ではなく、トップレベルの`dependencies {}`ブロックで行う必要があります。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## ソースセット階層のコンピレーション

Kotlinは、`dependsOn`関係を持つ[ソースセット階層](multiplatform-share-on-platforms#share-code-on-similar-platforms)を構築できます。

<img src="/img/jvm-js-main.svg" alt="ソースセット階層" style={{verticalAlign: 'middle'}}/>

ソースセット`jvmMain`がソースセット`commonMain`に依存している場合：

* `jvmMain`が特定のターゲットに対してコンパイルされるたびに、`commonMain`もそのコンピレーションに参加し、JVMクラスファイルなどの同じターゲットバイナリ形式にコンパイルされます。
* `jvmMain`のソースは、`commonMain`の宣言（内部宣言を含む）と、`implementation`依存関係として指定されたものも含め、`commonMain`の[依存関係](multiplatform-add-dependencies)を「認識」します。
* `jvmMain`には、`commonMain`の[期待される宣言](multiplatform-expect-actual)のプラットフォーム固有の実装を含めることができます。
* `commonMain`のリソースは、常に処理され、`jvmMain`のリソースとともにコピーされます。
* `jvmMain`と`commonMain`の[言語設定](multiplatform-dsl-reference#language-settings)は一貫している必要があります。

言語設定の一貫性は、次の方法で確認されます。
* `jvmMain`は、`commonMain`以上の`languageVersion`を設定する必要があります。
* `jvmMain`は、`commonMain`が有効にするすべての不安定な言語機能を有効にする必要があります（バグ修正機能にはそのような要件はありません）。
* `jvmMain`は、`commonMain`が使用するすべての実験的アノテーションを使用する必要があります。
* `apiVersion`、バグ修正言語機能、および`progressiveMode`は、任意に設定できます。

## GradleでIsolated Projects機能を設定する

:::caution
この機能は[試験的](components-stability#stability-levels-explained)であり、現在Gradleのプレアルファ段階にあります。
Gradleバージョン8.10以降でのみ、評価目的でのみ使用してください。この機能はいつでも削除または変更される可能性があります。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でフィードバックをお寄せください。
オプトインが必要です（詳細は下記参照）。

:::

Gradleは[Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)機能を提供し、
個々のプロジェクトを互いに「分離」することで、ビルドのパフォーマンスを向上させます。この機能は、ビルドスクリプト
とプラグインをプロジェクト間で分離し、安全に並行して実行できるようにします。

この機能を有効にするには、Gradleの手順に従って[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)します。

Isolated Projects機能の詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/isolated_projects.html)を参照してください。