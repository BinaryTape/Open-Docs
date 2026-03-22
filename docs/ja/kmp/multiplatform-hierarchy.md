[//]: # (title: 階層的なプロジェクト構造)

Kotlinマルチプラットフォーム（Kotlin Multiplatform）プロジェクトは、階層的なソースセット構造をサポートしています。
これは、[サポートされているターゲット](multiplatform-dsl-reference.md#targets)のすべてではなく、一部の間で共通コードを共有するための中間ソースセットの階層を構築できることを意味します。中間ソースセットを使用することで、以下のことが可能になります。

* **特定のターゲット向けに特定のAPIを提供する。** 例えば、ライブラリにおいて、Kotlin/Nativeターゲット用の中間ソースセットにはネイティブ固有のAPIを追加し、Kotlin/JVMターゲットには追加しないといったことが可能です。
* **特定のターゲット向けの特定のAPIを利用する。** 例えば、中間ソースセットを構成する一部のターゲットに対してKotlinマルチプラットフォームライブラリが提供する豊富なAPIを活用できます。
* **プロジェクトでプラットフォーム依存のライブラリを使用する。** 例えば、iOS中間ソースセットからiOS固有の依存関係にアクセスできます。

Kotlinツールチェーンは、各ソースセットが、そのソースセットがコンパイルされるすべてのターゲットで利用可能なAPIにのみアクセスできるように保証します。これにより、Windows固有のAPIを使用してmacOS向けにコンパイルしてしまい、実行時にリンケージエラーや未定義の動作が発生するといったケースを防ぐことができます。

ソースセット階層をセットアップする推奨される方法は、[デフォルトの階層テンプレート](#default-hierarchy-template)を使用することです。このテンプレートは、最も一般的なケースをカバーしています。より高度なプロジェクトの場合は、[手動で構成](#manual-configuration)することも可能です。これはより低レベルなアプローチであり、柔軟性は高いですが、より多くの労力と知識を必要とします。

## デフォルトの階層テンプレート

Kotlin Gradleプラグインには、組み込みのデフォルト[階層テンプレート](#see-the-full-hierarchy-template)が含まれています。これには、一般的なユースケース向けに事前に定義された中間ソースセットが含まれています。プラグインは、プロジェクトで指定されたターゲットに基づいて、これらのソースセットを自動的にセットアップします。

共有コードを含むプロジェクトモジュールの、以下の `build.gradle(.kts)` ファイルを考えてみましょう。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

コード内で `android`、`iosArm64`、`iosSimulatorArm64` ターゲットを宣言すると、Kotlin Gradleプラグインはテンプレートから適切な共有ソースセットを見つけ、それらを作成します。結果として得られる階層は以下のようになります。

![デフォルトの階層テンプレートの使用例](default-hierarchy-example.svg)

色の付いたソースセットは実際に作成されプロジェクトに存在しますが、デフォルトテンプレートにある灰色のソースセットは無視されます。例えば、プロジェクトにwatchOSターゲットがないため、Kotlin Gradleプラグインは `watchos` ソースセットを作成しません。

`watchosArm64` のようなwatchOSターゲットを追加すると、`watchos` ソースセットが作成され、`apple`、`native`、`common` ソースセットのコードも `watchosArm64` に対してコンパイルされるようになります。

Kotlin Gradleプラグインは、デフォルト階層テンプレートのすべてのソースセットに対して、型安全なアクセサと静的なアクセサの両方を提供します。そのため、[手動構成](#manual-configuration)と比較して、`by getting` や `by creating` などの構文を使わずに参照できます。

対応するターゲットを最初に宣言せずに共有モジュールの `build.gradle(.kts)` ファイルでソースセットにアクセスしようとすると、警告が表示されます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 警告：ターゲットを宣言せずにソースセットにアクセスしています
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 警告：ターゲットを宣言せずにソースセットにアクセスしています
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> この例では、`apple` と `native` ソースセットは `iosArm64` と `iosSimulatorArm64` ターゲットに対してのみコンパイルされます。名前に反して、これらは完全なiOS APIにアクセスできます。
> `native` のようなソースセットについては、すべてのネイティブターゲットで利用可能なAPIのみがアクセス可能であると期待するかもしれないため、これは直感に反する可能性があります。この動作は将来変更される可能性があります。
>
{style="note"}

### 追加の構成

デフォルトの階層テンプレートに調整を加える必要がある場合があります。以前に `dependsOn` 呼び出しを使用して[手動で](#manual-configuration)中間ソースを導入していた場合、デフォルトの階層テンプレートの使用がキャンセルされ、以下の警告が表示されます。

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

この問題を解決するには、以下のいずれかを行ってプロジェクトを構成してください。

* [手動構成をデフォルトの階層テンプレートに置き換える](#replacing-a-manual-configuration)
* [デフォルトの階層テンプレートに追加のソースセットを作成する](#creating-additional-source-sets)
* [デフォルトの階層テンプレートによって作成されたソースセットを変更する](#modifying-source-sets)

#### 手動構成の置き換え

**ケース**: すべての中間ソースセットが現在デフォルトの階層テンプレートでカバーされている場合。

**解決策**: 共有モジュールの `build.gradle(.kts)` ファイルで、手動の `dependsOn()` 呼び出しと `by creating` 構文を使用したソースセットをすべて削除します。すべてのデフォルトソースセットのリストを確認するには、[完全な階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

#### 追加のソースセットの作成

**ケース**: デフォルトの階層テンプレートがまだ提供していないソースセット（例えば、macOSターゲットとJVMターゲットの間のものなど）を追加したい場合。

**解決策**:

1. 共有モジュールの `build.gradle(.kts)` ファイルで、`applyDefaultHierarchyTemplate()` を明示的に呼び出してテンプレートを再適用します。
2. `dependsOn()` を使用して、追加のソースセットを[手動で構成](#manual-configuration)します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // デフォルトの階層を再度適用します。これにより、例えば iosMain ソースセットが作成されます。
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 追加の jvmAndMacos ソースセットを作成します。
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // デフォルトの階層を再度適用します。これにより、例えば iosMain ソースセットが作成されます。
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 追加の jvmAndMacos ソースセットを作成します。
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </TabItem>
    </Tabs>

#### ソースセットの変更

**ケース**: テンプレートによって生成されるものとまったく同じ名前のソースセットが既にあり、それらがプロジェクト内の異なるターゲットセット間で共有されている場合。例えば、`nativeMain` ソースセットがデスクトップ固有のターゲットである `linuxX64`、`mingwX64`、および `macosArm64` 間でのみ共有されているような場合です。

**解決策**: 現在、テンプレートのソースセット間のデフォルトの `dependsOn` 関係を変更する方法はありません。また、ソースセット（例：`nativeMain`）の実装と意味がすべてのプロジェクトで同じであることも重要です。

ただし、以下のいずれかを行うことができます。

* デフォルトの階層テンプレートまたは手動で作成されたソースセットの中から、目的に合った別のソースセットを探す。
* `gradle.properties` ファイルに `kotlin.mpp.applyDefaultHierarchyTemplate=false` を追加してテンプレートを完全に無効にし、すべてのソースセットを手動で構成する。

> 現在、独自の階層テンプレートを作成するためのAPIを開発中です。これは、階層構成がデフォルトテンプレートと大幅に異なるプロジェクトで役立ちます。
>
> このAPIはまだ準備が整っていませんが、試してみたい場合は、例として `applyHierarchyTemplate {}` ブロックと `KotlinHierarchyTemplate.default` の宣言を確認してください。このAPIはまだ開発中であることに注意してください。テストされていない可能性があり、今後のリリースで変更される可能性があります。
>
{style="tip"}

#### 完全な階層テンプレートを表示する {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルされるターゲットを宣言すると、プラグインはテンプレートから指定されたターゲットに基づいて共有ソースセットを選択し、プロジェクト内に作成します。

![デフォルトの階層テンプレート](full-template-hierarchy.svg)

> この例ではプロジェクトのプロダクション部分のみを示しており、`Main` サフィックスを省略しています（例えば、`commonMain` の代わりに `common` を使用）。ただし、`*Test` ソースについてもすべて同様です。
>
{style="tip"}

## 手動構成

ソースセット構造の中に、手動で中間ソースを導入することができます。これは複数のターゲットの共有コードを保持します。

例えば、ネイティブのLinux、Windows、およびmacOSターゲット（`linuxX64`、`mingwX64`、および `macosArm64`）の間でコードを共有したい場合は、次のようにします。

1. 共有モジュールの `build.gradle(.kts)` ファイルに、これらターゲットの共有ロジックを保持する中間ソースセット `myDesktopMain` を追加します。
2. `dependsOn` 関係を使用して、ソースセット階層をセットアップします。`commonMain` を `myDesktopMain` に接続し、次に `myDesktopMain` を各ターゲットソースセットに接続します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosArm64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosArm64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosArm64()
    
        sourceSets {
            myDesktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(myDesktopMain)
            }
            mingwX64Main {
                dependsOn(myDesktopMain)
            }
            macosArm64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

結果として得られる階層構造は以下のようになります。

![手動で構成された階層構造](manual-hierarchical-structure.svg)

以下のターゲットの組み合わせに対して、共有ソースセットを持つことができます。

* JVM または Android + Web + Native
* JVM または Android + Native
* Web + Native
* JVM または Android + Web
* Native

Kotlinは現在、以下の組み合わせのソースセットの共有をサポートしていません。

* 複数のJVMターゲット
* JVM + Androidターゲット
* 複数のJSターゲット

共有ネイティブソースセットからプラットフォーム固有のAPIにアクセスする必要がある場合、IntelliJ IDEAは、共有ネイティブコードで使用できる共通の宣言を検出するのを支援します。
その他のケースについては、Kotlinの[期待される宣言と実際の宣言 (expect/actual declarations)](multiplatform-expect-actual.md)のメカニズムを使用してください。