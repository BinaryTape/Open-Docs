[//]: # (title: 階層型プロジェクト構造)

Kotlin Multiplatformプロジェクトは、階層型ソースセット構造をサポートしています。
これにより、一部の[サポートされているターゲット](multiplatform-dsl-reference.md#targets)間で共通コードを共有するための中間ソースセットの階層を構成できますが、すべてのターゲット間で共有する必要はありません。中間ソースセットを使用すると、以下のことが可能になります。

*   特定のターゲットに固有のAPIを提供する。例えば、ライブラリはKotlin/Nativeターゲット向けの中間ソースセットにネイティブ固有のAPIを追加できますが、Kotlin/JVMターゲットには追加しません。
*   特定のターゲットに固有のAPIを利用する。例えば、中間ソースセットを形成する一部のターゲット向けにKotlin Multiplatformライブラリが提供する豊富なAPIを活用できます。
*   プロジェクトでプラットフォーム依存ライブラリを使用する。例えば、中間iOSソースセットからiOS固有の依存関係にアクセスできます。

Kotlinツールチェインは、各ソースセットが、そのソースセットがコンパイルされるすべてのターゲットで利用可能なAPIのみにアクセスできるようにします。これにより、Windows固有のAPIを使用してmacOSにコンパイルされ、結果としてリンケージエラーや実行時の未定義の動作が発生するようなケースを防ぎます。

ソースセットの階層を設定する推奨される方法は、[デフォルト階層テンプレート](#default-hierarchy-template)を使用することです。
このテンプレートは、最も一般的なケースをカバーしています。より高度なプロジェクトをお持ちの場合は、[手動で設定](#manual-configuration)できます。
これはより低レベルのアプローチであり、より柔軟ですが、より多くの労力と知識を必要とします。

## デフォルト階層テンプレート

Kotlin Gradleプラグインには、組み込みのデフォルト[階層テンプレート](#see-the-full-hierarchy-template)があります。
これには、いくつかの一般的なユースケース向けに事前定義された中間ソースセットが含まれています。
プラグインは、プロジェクトで指定されたターゲットに基づいて、これらのソースセットを自動的に設定します。

共有コードを含むプロジェクトモジュール内の以下の`build.gradle(.kts)`ファイルを考慮してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
</tabs>

コードで`androidTarget`、`iosArm64`、および`iosSimulatorArm64`ターゲットを宣言すると、Kotlin Gradleプラグインはテンプレートから適切な共有ソースセットを見つけて自動的に作成します。結果として得られる階層は次のようになります。

![An example of using the default hierarchy template](default-hierarchy-example.svg)

色付きのソースセットは実際に作成されプロジェクトに存在しますが、デフォルトテンプレートの灰色部分は無視されます。例えば、Kotlin Gradleプラグインは、プロジェクトにwatchOSターゲットがないため、`watchos`ソースセットを作成しませんでした。

`watchosArm64`のようなwatchOSターゲットを追加すると、`watchos`ソースセットが作成され、`apple`、`native`、および`common`ソースセットからのコードも`watchosArm64`にコンパイルされます。

Kotlin Gradleプラグインは、デフォルト階層テンプレートからのすべてのソースセットに対して、型安全なアクセサーと静的アクセサーの両方を提供しているため、[手動設定](#manual-configuration)と比較して、`by getting`や`by creating`構成を使わずにそれらを参照できます。

共有モジュールの`build.gradle(.kts)`ファイルで、対応するターゲットを最初に宣言せずにソースセットにアクセスしようとすると、警告が表示されます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</tab>
</tabs>

> この例では、`apple`および`native`ソースセットは`iosArm64`および`iosSimulatorArm64`ターゲットにのみコンパイルされます。
> その名前にもかかわらず、これらのソースセットは完全なiOS APIにアクセスできます。
> これは、`native`のようなソースセットにとっては直感に反するかもしれません。なぜなら、このソースセットではすべてのネイティブターゲットで利用可能なAPIのみがアクセス可能だと期待されるかもしれないからです。この動作は将来変更される可能性があります。
> {style="note"}

### 追加設定

デフォルト階層テンプレートに調整を加える必要がある場合があります。以前に`dependsOn`呼び出しで中間ソースを[手動で](#manual-configuration)導入している場合、それはデフォルト階層テンプレートの使用をキャンセルし、以下の警告につながります。

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

この問題を解決するには、以下のいずれかの方法でプロジェクトを設定してください。

*   [手動設定をデフォルト階層テンプレートに置き換える](#replacing-a-manual-configuration)
*   [デフォルト階層テンプレートにソースセットを追加作成する](#creating-additional-source-sets)
*   [デフォルト階層テンプレートによって作成されたソースセットを変更する](#modifying-source-sets)

#### 手動設定の置き換え

**ケース**. すべての中間ソースセットが現在、デフォルト階層テンプレートでカバーされている場合。

**解決策**. 共有モジュールの`build.gradle(.kts)`ファイルで、すべての手動`dependsOn()`呼び出しと`by creating`構成を持つソースセットを削除します。すべてのデフォルトソースセットのリストを確認するには、[完全な階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

#### 追加のソースセットを作成する

**ケース**. 例えば、macOSターゲットとJVMターゲットの間に、デフォルト階層テンプレートがまだ提供していないソースセットを追加したい場合。

**解決策**:

1.  共有モジュールの`build.gradle(.kts)`ファイルで、`applyDefaultHierarchyTemplate()`を明示的に呼び出してテンプレートを再適用します。
2.  `dependsOn()`を使用して追加のソースセットを[手動で設定](#manual-configuration)します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
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

    </tab>
    </tabs>

#### ソースセットの変更

**ケース**. テンプレートによって生成されたものとまったく同じ名前のソースセットをすでに持っているが、それらがプロジェクト内の異なるターゲットセット間で共有されている場合。例えば、`nativeMain`ソースセットが`linuxX64`、`mingwX64`、`macosX64`といったデスクトップ固有のターゲット間でのみ共有されている場合。

**解決策**. 現在、テンプレートのソースセット間のデフォルトの`dependsOn`関係を変更する方法はありません。
また、`nativeMain`のようなソースセットの実装と意味がすべてのプロジェクトで同じであることも重要です。

ただし、以下のいずれかを実行できます。

*   デフォルト階層テンプレートまたは手動で作成されたソースセットの中から、目的に合った異なるソースセットを見つけます。
*   `gradle.properties`ファイルに`kotlin.mpp.applyDefaultHierarchyTemplate=false`を追加してテンプレートから完全にオプトアウトし、すべてのソースセットを手動で設定します。

> 現在、独自の階層テンプレートを作成するためのAPIを開発中です。これは、階層構成がデフォルトテンプレートと大きく異なるプロジェクトにとって役立つでしょう。
>
> このAPIはまだ準備ができていませんが、試してみたい場合は、`applyHierarchyTemplate {}`ブロックと`KotlinHierarchyTemplate.default`の宣言を例として参照してください。
> このAPIはまだ開発中であることに留意してください。テストされていない可能性があり、今後のリリースで変更される可能性があります。
> {style="tip"}

#### 完全な階層テンプレートを参照 {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルされるターゲットを宣言すると、
プラグインは指定されたターゲットに基づいてテンプレートから共有ソースセットを選択し、プロジェクト内にそれらを作成します。

![Default hierarchy template](full-template-hierarchy.svg)

> この例はプロジェクトのプロダクション部分のみを示しており、`Main`サフィックスは省略されています
> (例えば、`commonMain`の代わりに`common`を使用しています)。しかし、`*Test`ソースについてもすべて同じです。
> {style="tip"}

## 手動設定

ソースセット構造に中間ソースを手動で導入できます。
これには複数のターゲットの共有コードが保持されます。

例えば、Linux、Windows、macOSのネイティブターゲット（`linuxX64`、`mingwX64`、`macosX64`）間でコードを共有したい場合、次の手順を実行します。

1.  共有モジュールの`build.gradle(.kts)`ファイルに、これらのターゲットの共有ロジックを保持する中間ソースセット`desktopMain`を追加します。
2.  `dependsOn`関係を使用して、ソースセットの階層を設定します。`commonMain`を`desktopMain`に接続し、次に`desktopMain`を各ターゲットソースセットに接続します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </tab>
    </tabs>

結果として得られる階層構造は次のようになります。

![Manually configured hierarchical structure](manual-hierarchical-structure.svg)

以下のターゲットの組み合わせに対して、共有ソースセットを持つことができます。

*   JVM または Android + JS + Native
*   JVM または Android + Native
*   JS + Native
*   JVM または Android + JS
*   Native

Kotlinは現在、以下の組み合わせでのソースセットの共有をサポートしていません。

*   複数のJVMターゲット
*   JVM + Androidターゲット
*   複数のJSターゲット

共有ネイティブソースセットからプラットフォーム固有のAPIにアクセスする必要がある場合、IntelliJ IDEAは共有ネイティブコードで使用できる共通の宣言を検出するのに役立ちます。
その他のケースでは、Kotlinの[expectedおよびactual宣言](multiplatform-expect-actual.md)のメカニズムを使用してください。