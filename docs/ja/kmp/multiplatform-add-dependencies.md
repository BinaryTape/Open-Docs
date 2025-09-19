[//]: # (title: マルチプラットフォームライブラリへの依存関係の追加)

すべてのプログラムは、正常に動作するために一連のライブラリを必要とします。Kotlin Multiplatformプロジェクトは、すべてのターゲットプラットフォームで動作するマルチプラットフォームライブラリ、プラットフォーム固有のライブラリ、および他のマルチプラットフォームプロジェクトに依存できます。

ライブラリへの依存関係を追加するには、共有コードを含むプロジェクトのディレクトリにある`build.gradle(.kts)`ファイルを更新します。[`dependencies {}`](multiplatform-dsl-reference.md#dependencies)ブロック内で、必要な[型](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)（例: `implementation`）の依存関係を設定します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // すべてのソースセットで共有されるライブラリ
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Kotlinライブラリへの依存関係

### 標準ライブラリ

各ソースセットへの標準ライブラリ（`stdlib`）の依存関係は自動的に追加されます。標準ライブラリのバージョンは、`kotlin-multiplatform`プラグインのバージョンと同じです。

プラットフォーム固有のソースセットには、対応するプラットフォーム固有のライブラリバリアントが使用され、それ以外のソースセットには共通の標準ライブラリが追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`compilerOptions.jvmTarget` [コンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)に応じて、適切なJVM標準ライブラリを選択します。

[デフォルトの動作を変更する方法](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)について学習してください。

### テストライブラリ

マルチプラットフォームテストには、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIが利用可能です。マルチプラットフォームプロジェクトを作成する際、`commonTest`に単一の依存関係を追加することで、すべてのソースセットにテスト依存関係を追加できます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // すべてのプラットフォーム依存関係を自動的に提供します
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // すべてのプラットフォーム依存関係を自動的に提供します
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinxライブラリ

マルチプラットフォームライブラリを使用し、[共有コードに依存する必要がある](#library-shared-for-all-source-sets)場合、依存関係は共有ソースセットに一度だけ設定します。`kotlinx-coroutines-core`などのライブラリベースのアーティファクト名を使用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

[プラットフォーム固有の依存関係](#library-used-in-specific-source-sets)としてkotlinxライブラリが必要な場合でも、対応するプラットフォームソースセットでライブラリのベースアーティファクト名を使用できます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Kotlin Multiplatformライブラリへの依存関係

[SQLDelight](https://github.com/cashapp/sqldelight)など、Kotlin Multiplatformテクノロジーを採用しているライブラリへの依存関係を追加できます。これらのライブラリの作者は通常、プロジェクトに依存関係を追加するためのガイドを提供しています。

> JetBrainsの[検索プラットフォーム](https://klibs.io/)でKotlin Multiplatformライブラリを探してください。
>
{style="tip"}

### すべてのソースセットで共有されるライブラリ

すべてのソースセットからライブラリを使用したい場合、共通ソースセットにのみ追加できます。Kotlin Multiplatformプラグインは、対応する部分を他のソースセットに自動的に追加します。

> 共通ソースセットでプラットフォーム固有のライブラリに依存関係を設定することはできません。
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // ktor-client のプラットフォーム部分への依存関係が自動的に追加されます
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
            }
        }
        androidMain {
            dependencies {
                // ktor-client のプラットフォーム部分への依存関係が自動的に追加されます
            }
        }
    }
}
```

</TabItem>
</Tabs>

> トップレベルの`dependencies {}`ブロックで共通ライブラリを設定することもできます。[トップレベルで依存関係を設定する](multiplatform-dsl-reference.md#configure-dependencies-at-the-top-level)を参照してください。
>
{style="tip"}

### 特定のソースセットで使用されるライブラリ

マルチプラットフォームライブラリを特定のソースセットでのみ使用したい場合は、それらにのみ追加できます。その場合、指定されたライブラリの宣言は、それらのソースセットでのみ利用可能になります。

> このような場合、共通のライブラリ名を使用し、プラットフォーム固有のものではないものを使用してください。以下の例のSQLDelightのように、`native-driver-iosx64`ではなく`native-driver`を使用します。正確な名前はライブラリのドキュメントで確認してください。
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines はすべてのソースセットで利用可能になります
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight は iOS ソースセットでのみ利用可能になり、Android や共通ソースセットでは利用できません
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines はすべてのソースセットで利用可能になります
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight は iOS ソースセットでのみ利用可能になり、Android や共通ソースセットでは利用できません
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</TabItem>
</Tabs>

## 他のマルチプラットフォームプロジェクトへの依存関係

あるマルチプラットフォームプロジェクトを別のプロジェクトに依存関係として接続できます。これを行うには、必要なソースセットにプロジェクトの依存関係を追加するだけです。すべてのソースセットで依存関係を使用したい場合は、共通ソースセットに追加します。この場合、他のソースセットは自動的にそのバージョンを取得します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-module のプラットフォーム部分が自動的に追加されます
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // :some-other-multiplatform-module のプラットフォーム部分が自動的に追加されます
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 次のステップ

マルチプラットフォームプロジェクトへの依存関係の追加に関する他のリソースを確認し、以下について詳しく学びましょう。

*   [Androidの依存関係を追加する](multiplatform-android-dependencies.md)
*   [iOSの依存関係を追加する](multiplatform-ios-dependencies.md)
*   [iOS、Android、デスクトップ、およびウェブをターゲットとするCompose Multiplatformプロジェクトに新しい依存関係を追加する](compose-multiplatform-modify-project.md#add-a-new-dependency)