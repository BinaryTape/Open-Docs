[//]: # (title: マルチプラットフォームライブラリへの依存関係の追加)

すべてのプログラムは、正常に動作するために一連のライブラリを必要とします。Kotlin Multiplatformプロジェクトは、すべてのターゲットプラットフォームで動作するマルチプラットフォームライブラリ、プラットフォーム固有のライブラリ、および他のマルチプラットフォームプロジェクトに依存できます。

ライブラリへの依存関係を追加するには、共有コードを含むプロジェクトのディレクトリにある`build.gradle(.kts)`ファイルを更新します。必要な[タイプ](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types) (例えば、`implementation`) の依存関係を[`dependencies {}`](multiplatform-dsl-reference.md#dependencies)ブロックで設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

あるいは、[トップレベルで依存関係を設定する](https://kotlinlang.org/docs/gradle-configure-project.html#set-dependencies-at-top-level)こともできます。

## Kotlinライブラリへの依存

### 標準ライブラリ

各ソースセットにおける標準ライブラリ (`stdlib`) への依存関係は自動的に追加されます。標準ライブラリのバージョンは、`kotlin-multiplatform`プラグインのバージョンと同じです。

プラットフォーム固有のソースセットでは、ライブラリの対応するプラットフォーム固有のバリアントが使用され、それ以外の部分には共通の標準ライブラリが追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`compilerOptions.jvmTarget` [コンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)に応じて、適切なJVM標準ライブラリを選択します。

デフォルトの動作を[変更する方法](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)については、こちらをご覧ください。

### テストライブラリ

マルチプラットフォームテストの場合、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIが利用可能です。マルチプラットフォームプロジェクトを作成する際、`commonTest`に単一の依存関係を使用することで、すべてのソースセットにテスト依存関係を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // すべてのプラットフォーム依存関係を自動的に追加します
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // すべてのプラットフォーム依存関係を自動的に追加します
            }
        }
    }
}
```

</tab>
</tabs>

### kotlinxライブラリ

マルチプラットフォームライブラリを使用し、[共有コードに依存する](#library-shared-for-all-source-sets)必要がある場合は、共有ソースセットで一度だけ依存関係を設定します。`kotlinx-coroutines-core`などのライブラリのベースアーティファクト名を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

[プラットフォーム固有の依存関係](#library-used-in-specific-source-sets)としてkotlinxライブラリが必要な場合でも、対応するプラットフォームソースセットでライブラリのベースアーティファクト名を使用できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## Kotlin Multiplatformライブラリへの依存

[SQLDelight](https://github.com/cashapp/sqldelight)など、Kotlin Multiplatform技術を採用しているライブラリへの依存関係を追加できます。これらのライブラリの作者は通常、それらの依存関係をプロジェクトに追加するためのガイドを提供しています。

> Kotlin Multiplatformライブラリは、[JetBrainsの検索プラットフォーム](https://klibs.io/)で探すことができます。
>
{style="tip"}

### すべてのソースセットで共有されるライブラリ

すべてのソースセットからライブラリを使用したい場合、共通ソースセットにのみ追加できます。Kotlin Multiplatform Mobileプラグインは、対応する部分を他のソースセットに自動的に追加します。

> 共通ソースセットでは、プラットフォーム固有のライブラリへの依存関係を設定できません。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // ktor-clientのプラットフォーム部分への依存関係は自動的に追加されます
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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
                // ktor-clientのプラットフォーム部分への依存関係は自動的に追加されます
            }
        }
    }
}
```

</tab>
</tabs>

### 特定のソースセットで使用されるライブラリ

特定のソースセットでのみマルチプラットフォームライブラリを使用したい場合、それらのソースセットにのみ排他的に追加できます。指定されたライブラリ宣言は、それらのソースセットでのみ利用可能になります。

> このような場合は、プラットフォーム固有のライブラリ名ではなく、共通のライブラリ名を使用してください。以下のSQLDelightの例のように、`native-driver-iosx64`ではなく、`native-driver`を使用します。正確な名前はライブラリのドキュメントで確認してください。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutinesはすべてのソースセットで利用可能になります
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelightはiOSソースセットでのみ利用可能となり、Androidまたはcommonでは利用できません
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutinesはすべてのソースセットで利用可能になります
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelightはiOSソースセットでのみ利用可能となり、Androidまたはcommonでは利用できません
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</tab>
</tabs>

## 他のマルチプラットフォームプロジェクトへの依存

あるマルチプラットフォームプロジェクトを別のプロジェクトに依存関係として接続できます。これを行うには、必要なソースセットにプロジェクト依存関係を追加するだけです。すべてのソースセットで依存関係を使用したい場合は、共通ソースセットに追加してください。この場合、他のソースセットは自動的にそのバージョンを取得します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-moduleのプラットフォーム部分が自動的に追加されます
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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
                // :some-other-multiplatform-moduleのプラットフォーム部分が自動的に追加されます
            }
        }
    }
}
```

</tab>
</tabs>

## 次のステップ

マルチプラットフォームプロジェクトにおける依存関係の追加に関する他のリソースも確認し、詳細については以下をご覧ください。

*   [Android依存関係の追加](multiplatform-android-dependencies.md)
*   [iOS依存関係の追加](multiplatform-ios-dependencies.md)
*   [iOS、Android、デスクトップ、ウェブをターゲットとするCompose Multiplatformプロジェクトでの依存関係の追加](compose-multiplatform-modify-project.md#add-a-new-dependency)