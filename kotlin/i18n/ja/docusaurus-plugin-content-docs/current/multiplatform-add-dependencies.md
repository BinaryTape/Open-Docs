---
title: マルチプラットフォームライブラリへの依存関係の追加
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

すべてのプログラムは、正常に動作するためにライブラリのセットを必要とします。Kotlin Multiplatformプロジェクトは、
すべてのターゲットプラットフォームで動作するmultiplatformライブラリ、プラットフォーム固有のライブラリ、およびその他のmultiplatformプロジェクトに依存できます。

ライブラリへの依存関係を追加するには、共有コードを含むプロジェクトのディレクトリにある`build.gradle(.kts)`ファイルを更新します。必要な[type](gradle-configure-project#dependency-types)（たとえば、`implementation`）の依存関係を、[`dependencies {}`](multiplatform-dsl-reference#dependencies)
ブロックに設定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // すべてのソースセットで共有されるライブラリ
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

または、[トップレベルで依存関係を設定](gradle-configure-project#set-dependencies-at-top-level)することもできます。

## Kotlinライブラリへの依存関係

### 標準ライブラリ

各ソースセットの標準ライブラリ（`stdlib`）への依存関係は自動的に追加されます。標準
ライブラリのバージョンは、`kotlin-multiplatform`プラグインのバージョンと同じです。

プラットフォーム固有のソースセットの場合、ライブラリの対応するプラットフォーム固有のバリアントが使用されますが、共通
標準ライブラリが残りの部分に追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`compilerOptions.jvmTarget` [compiler option](gradle-compiler-options)に応じて、適切なJVM標準ライブラリを選択します。

[デフォルトの動作を変更する](gradle-configure-project#dependency-on-the-standard-library)方法をご覧ください。

### テストライブラリ

multiplatformテストの場合、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIが利用可能です。multiplatformプロジェクトを作成するときに、`commonTest`で単一の依存関係を使用することにより、すべてのソースセットにテストの依存関係を追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // すべてのプラットフォームの依存関係を自動的に取り込みます
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // すべてのプラットフォームの依存関係を自動的に取り込みます
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinxライブラリ

multiplatformライブラリを使用しており、[共有コードに依存する必要がある](#library-shared-for-all-source-sets)場合は、
共有ソースセットに一度だけ依存関係を設定します。`kotlinx-coroutines-core`などのライブラリのベースアーティファクト名を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

[プラットフォーム固有の依存関係](#library-used-in-specific-source-sets)にkotlinxライブラリが必要な場合は、
対応するプラットフォームソースセットでライブラリのベースアーティファクト名を使用できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Kotlin Multiplatformライブラリへの依存関係

[SQLDelight](https://github.com/cashapp/sqldelight)など、Kotlin Multiplatformテクノロジーを採用しているライブラリに依存関係を追加できます。これらのライブラリの作成者は通常、プロジェクトに依存関係を追加するためのガイドを提供しています。

:::note
[JetBrainsの検索プラットフォーム](https://klibs.io/)でKotlin Multiplatformライブラリを探してください。

### すべてのソースセットで共有されるライブラリ

すべてのソースセットからライブラリを使用する場合は、共通ソースセットにのみ追加できます。Kotlin
Multiplatform Mobileプラグインは、対応するパーツを他のソースセットに自動的に追加します。

共通ソースセットでは、プラットフォーム固有のライブラリに依存関係を設定できません。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:3.1.1")
        }
        androidMain.dependencies {
            // ktor-clientのプラットフォーム部分への依存関係が自動的に追加されます
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:3.1.1'
            }
        }
        androidMain {
            dependencies {
                // ktor-clientのプラットフォーム部分への依存関係が自動的に追加されます
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 特定のソースセットで使用されるライブラリ

multiplatformライブラリを特定のソースセットでのみ使用する場合は、それらのソースセットにのみ排他的に追加できます。
指定されたライブラリ宣言は、それらのソースセットでのみ使用可能になります。

このような場合は、プラットフォーム固有の名前ではなく、共通ライブラリ名を使用してください。以下の例のSQLDelightと同様に、`native-driver-iosx64`ではなく`native-driver`を使用してください。ライブラリのドキュメントで正確な名前を見つけてください。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutinesはすべてのソースセットで使用可能になります
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelightはiOSソースセットでのみ使用可能になり、Androidまたは共通では使用できません
            implementation("com.squareup.sqldelight:native-driver:2.0.2")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutinesはすべてのソースセットで使用可能になります
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelightはiOSソースセットでのみ使用可能になり、Androidまたは共通では使用できません
                implementation 'com.squareup.sqldelight:native-driver:2.0.2'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 別のmultiplatformプロジェクトへの依存関係

multiplatformプロジェクトを依存関係として別のプロジェクトに接続できます。これを行うには、プロジェクトの依存関係を必要なソースセットに追加するだけです。すべてのソースセットで依存関係を使用する場合は、共通のソースセットに追加します。この場合、他のソースセットは自動的にバージョンを取得します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

</TabItem>
</Tabs>

## 次のステップ

multiplatformプロジェクトでの依存関係の追加に関するその他のリソースを確認し、以下についてさらに詳しく学んでください。

* [Androidの依存関係の追加](multiplatform-android-dependencies)
* [iOSの依存関係の追加](multiplatform-ios-dependencies)