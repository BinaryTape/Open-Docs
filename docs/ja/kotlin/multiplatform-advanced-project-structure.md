---
title: マルチプラットフォームプロジェクト構造の高度な概念
---
この記事では、Kotlin Multiplatformプロジェクトの高度な概念とそのGradle実装へのマッピングについて説明します。この情報は、Gradleビルドの低レベルな抽象化（構成、タスク、パブリケーションなど）を扱う必要がある場合や、Kotlin Multiplatformビルド用のGradleプラグインを作成する場合に役立ちます。

このページは、以下の場合に役立ちます。

* Kotlinがソースセットを作成しないターゲット間でコードを共有する必要がある場合。
* Kotlin Multiplatformビルド用のGradleプラグインを作成したい場合、または構成、タスク、パブリケーションなど、Gradleビルドの低レベルな抽象化を扱う必要がある場合。

マルチプラットフォームプロジェクトにおける依存関係管理について理解する上で重要なことの1つは、Gradleスタイルのプロジェクトまたはライブラリの依存関係と、Kotlinに固有のソースセット間の`dependsOn`関係の違いです。

* `dependsOn`は、[ソースセット階層](#dependson-and-source-set-hierarchies)を有効にし、一般的にマルチプラットフォームプロジェクトでコードを共有できるようにする、共通ソースセットとプラットフォーム固有のソースセット間の関係です。デフォルトのソースセットの場合、階層は自動的に管理されますが、特定の状況では変更する必要がある場合があります。
* 一般的なライブラリとプロジェクトの依存関係は通常どおりに機能しますが、マルチプラットフォームプロジェクトでそれらを適切に管理するには、コンパイルに使用される粒度の細かい**ソースセット → ソースセット**の依存関係に[Gradleの依存関係がどのように解決されるか](#dependencies-on-other-libraries-or-projects)を理解する必要があります。

:::note
高度な概念に入る前に、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project)を学ぶことをお勧めします。

## dependsOnとソースセット階層

通常は、_`dependsOn`_ 関係ではなく、_依存関係_を扱います。ただし、`dependsOn`を調べることは、Kotlin Multiplatformプロジェクトがどのように機能するかを理解する上で非常に重要です。

`dependsOn`は、2つのKotlinソースセット間のKotlin固有の関係です。これは、共通ソースセットとプラットフォーム固有のソースセット間の接続である可能性があります。たとえば、`jvmMain`ソースセットが`commonMain`に依存し、`iosArm64Main`が`iosMain`に依存する場合などです。

Kotlinソースセット`A`と`B`の一般的な例を考えてみましょう。式`A.dependsOn(B)`は、Kotlinに以下を指示します。

1. `A`は、内部宣言を含む、`B`からのAPIを監視します。
2. `A`は、`B`からの期待される宣言に対する実際の実装を提供できます。これは必要十分条件であり、`A`は`A.dependsOn(B)`が直接または間接的に存在する場合にのみ、`B`に対して`actuals`を提供できます。
3. `B`は、独自のターゲットに加えて、`A`がコンパイルされるすべてのターゲットにコンパイルする必要があります。
4. `A`は、`B`のすべての通常の依存関係を継承します。

`dependsOn`関係は、ソースセット階層として知られるツリーのような構造を作成します。以下は、`androidTarget`、`iosArm64`（iPhoneデバイス）、および`iosSimulatorArm64`（Apple Silicon Mac用のiPhoneシミュレーター）を使用したモバイル開発の典型的なプロジェクトの例です。

<img src="/img/dependson-tree-diagram.svg" alt="DependsOn tree structure" width="700" style={{verticalAlign: 'middle'}}/>

矢印は`dependsOn`関係を表します。
これらの関係は、プラットフォームバイナリのコンパイル中に保持されます。これは、Kotlinが`iosMain`が`commonMain`からのAPIを見るべきであり、`iosArm64Main`からは見るべきではないことを理解する方法です。

<img src="/img/dependson-relations-diagram.svg" alt="DependsOn relations during compilation" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn`関係は、`KotlinSourceSet.dependsOn(KotlinSourceSet)`呼び出しで構成されます。例：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* この例は、`dependsOn`関係がビルドスクリプトでどのように定義できるかを示しています。ただし、Kotlin Gradleプラグインは、デフォルトでソースセットを作成し、これらの関係を設定するため、手動で行う必要はありません。
* `dependsOn`関係は、ビルドスクリプトの`dependencies {}`ブロックとは別に宣言されます。これは、`dependsOn`が通常の依存関係ではないためです。代わりに、これは、異なるターゲット間でコードを共有するために必要なKotlinソースセット間の特定の関係です。

`dependsOn`を使用して、公開されたライブラリまたは別のGradleプロジェクトに対する通常の依存関係を宣言することはできません。
たとえば、`commonMain`が`kotlinx-coroutines-core`ライブラリの`commonMain`に依存するように設定したり、`commonTest.dependsOn(commonMain)`を呼び出したりすることはできません。

### カスタムソースセットの宣言

場合によっては、プロジェクトにカスタムの中間ソースセットが必要になる場合があります。
JVM、JS、およびLinuxにコンパイルされるプロジェクトを考えてみましょう。一部のソースをJVMとJSの間でのみ共有したいとします。
この場合、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project)で説明されているように、このターゲットのペアに固有のソースセットを見つける必要があります。

Kotlinは、このようなソースセットを自動的に作成しません。つまり、`by creating`構造を使用して手動で作成する必要があります。

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

ただし、Kotlinは、このソースセットをどのように扱うか、またはコンパイルするかをまだ知りません。図を描いた場合、
このソースセットは分離され、ターゲットラベルは表示されません。

<img src="/img/missing-dependson-diagram.svg" alt="Missing dependsOn relation" width="700" style={{verticalAlign: 'middle'}}/>

これを修正するには、いくつかの`dependsOn`関係を追加して、`jvmAndJsMain`を階層に含めます。

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

ここで、`jvmMain.dependsOn(jvmAndJsMain)`はJVMターゲットを`jvmAndJsMain`に追加し、`jsMain.dependsOn(jvmAndJsMain)`はJSターゲットを`jvmAndJsMain`に追加します。

最終的なプロジェクト構造は次のようになります。

<img src="/img/final-structure-diagram.svg" alt="Final project structure" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn`関係の手動構成は、デフォルトの階層テンプレートの自動適用を無効にします。
このようなケースとその処理方法の詳細については、[追加の構成](multiplatform-hierarchy#additional-configuration)を参照してください。

:::

## 他のライブラリまたはプロジェクトへの依存関係

マルチプラットフォームプロジェクトでは、公開されたライブラリまたは別のGradleプロジェクトへの通常の依存関係を設定できます。

Kotlin Multiplatformは、通常、典型的なGradleの方法で依存関係を宣言します。Gradleと同様に、

* ビルドスクリプトで`dependencies {}`ブロックを使用します。
* 依存関係に適切なスコープ（`implementation`や`api`など）を選択します。
* リポジトリに公開されている場合は座標（`"com.google.guava:guava:32.1.2-jre"`など）を指定するか、同じビルド内のGradleプロジェクトの場合はパス（`project(":utils:concurrency")`など）を指定して、依存関係を参照します。

マルチプラットフォームプロジェクトの依存関係構成には、いくつかの特別な機能があります。各Kotlinソースセットには、独自の`dependencies {}`ブロックがあります。これにより、プラットフォーム固有の依存関係をプラットフォーム固有のソースセットで宣言できます。

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

共通の依存関係はより複雑です。マルチプラットフォームライブラリ（たとえば、`kotlinx.coroutines`）への依存関係を宣言するマルチプラットフォームプロジェクトを考えてみましょう。

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依存関係の解決には、3つの重要な概念があります。

1. マルチプラットフォームの依存関係は、`dependsOn`構造を下に伝播されます。`commonMain`に依存関係を追加すると、`commonMain`で直接または間接的に`dependsOn`関係を宣言するすべてのソースセットに自動的に追加されます。

   この場合、依存関係は実際にすべての`*Main`ソースセット（`iosMain`、`jvmMain`、`iosSimulatorArm64Main`、および`iosX64Main`）に自動的に追加されました。これらのすべてのソースセットは、`commonMain`ソースセットから`kotlin-coroutines-core`依存関係を継承するため、それらすべてに手動でコピーアンドペーストする必要はありません。

   <img src="/img/dependency-propagation-diagram.svg" alt="Propagation of multiplatform dependencies" width="700" style={{verticalAlign: 'middle'}}/>

   > 伝播メカニズムを使用すると、特定のソースセットを選択することで、宣言された依存関係を受け取るスコープを選択できます。
   > たとえば、AndroidではなくiOSで`kotlinx.coroutines`を使用する場合は、この依存関係を`iosMain`にのみ追加できます。
   >
   

2. _ソースセット → マルチプラットフォームライブラリ_の依存関係（上記の`commonMain`から`org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`など）は、依存関係解決の中間状態を表します。解決の最終状態は、常に_ソースセット → ソースセット_の依存関係によって表されます。

   > 最終的な_ソースセット → ソースセット_の依存関係は、`dependsOn`関係ではありません。
   >
   

   粒度の細かい_ソースセット → ソースセット_の依存関係を推測するために、Kotlinは各マルチプラットフォームライブラリとともに公開されるソースセット構造を読み取ります。このステップの後、各ライブラリは全体としてではなく、そのソースセットのコレクションとして内部的に表されます。`kotlinx-coroutines-core`の例を以下に示します。

   <img src="/img/structure-serialization-diagram.svg" alt="Serialization of the source set structure" width="700" style={{verticalAlign: 'middle'}}/>

3. Kotlinは、各依存関係の関係を取得し、それを依存関係からのソースセットのコレクションに解決します。
   そのコレクション内の各依存関係ソースセットは、_互換性のあるターゲット_を持つ必要があります。依存関係ソースセット
   は、コンシューマーソースセットと_少なくとも同じターゲット_にコンパイルされる場合に、互換性のあるターゲットを持ちます。

   サンプルプロジェクトの`commonMain`が`androidTarget`、`iosX64`、および`iosSimulatorArm64`にコンパイルされる例を考えてみましょう。

    * まず、`kotlinx-coroutines-core.commonMain`への依存関係を解決します。これは、`kotlinx-coroutines-core`が
      可能なすべてのKotlinターゲットにコンパイルされるためです。したがって、その`commonMain`は、必要な`androidTarget`、`iosX64`、および`iosSimulatorArm64`を含む、可能なすべてのターゲットにコンパイルされます。
    * 次に、`commonMain`は`kotlinx-coroutines-core.concurrentMain`に依存します。
      `kotlinx-coroutines-core`の`concurrentMain`はJSを除くすべてのターゲットにコンパイルされるため、
      コンシューマープロジェクトの`commonMain`のターゲットに一致します。

   ただし、コルーチンの`iosX64Main`のようなソースセットは、コンシューマーの`commonMain`と互換性がありません。
   `iosX64Main`は`commonMain`のターゲットの1つ（つまり、`iosX64`）にコンパイルされますが、
   `androidTarget`または`iosSimulatorArm64`のいずれにもコンパイルされません。

   依存関係の解決の結果は、`kotlinx-coroutines-core`のどのコードが表示されるかに直接影響します。

   <img src="/img/dependency-resolution-error.png" alt="Error on JVM-specific API in common code" width="700" style={{verticalAlign: 'middle'}}/>

### ソースセット全体の共通依存関係のバージョンの調整

Kotlin Multiplatformプロジェクトでは、共通ソースセットは、klibを生成するために、また構成された各[コンパイル](multiplatform-configure-compilations)の一部として、複数回コンパイルされます。一貫性のあるバイナリを生成するには、共通コードを常にマルチプラットフォーム依存関係の同じバージョンに対してコンパイルする必要があります。Kotlin Gradleプラグインは、これらの依存関係を調整し、有効な依存関係のバージョンが各ソースセットで同じになるようにするのに役立ちます。

上記の例では、`androidx.navigation:navigation-compose:2.7.7`依存関係を`androidMain`ソースセットに追加するとします。プロジェクトは`commonMain`ソースセットの`kotlinx-coroutines-core:1.7.3`依存関係を明示的に宣言していますが、バージョン2.7.7のCompose NavigationライブラリにはKotlinコルーチン1.8.0以降が必要です。

`commonMain`と`androidMain`は一緒にコンパイルされるため、Kotlin Gradleプラグインは2つのバージョンのコルーチンライブラリから選択し、`kotlinx-coroutines-core:1.8.0`を`commonMain`ソースセットに適用します。ただし、共通コードが構成されたすべてのターゲットで一貫してコンパイルされるようにするには、iOSソースセットも同じ依存関係のバージョンに制約する必要があります。したがって、Gradleは`kotlinx.coroutines-*:1.8.0`依存関係を`iosMain`ソースセットにも伝播します。

<img src="/img/multiplatform-source-set-dependency-alignment.svg" alt="Alignment of dependencies among *Main source sets" width="700" style={{verticalAlign: 'middle'}}/>

依存関係は、`*Main`ソースセットと[`*Test`ソースセット](multiplatform-discover-project#integration-with-tests)の間で個別に調整されます。`*Test`ソースセットのGradle構成には、`*Main`ソースセットのすべての依存関係が含まれますが、その逆はありません。したがって、メインコードに影響を与えることなく、新しいライブラリバージョンでプロジェクトをテストできます。

たとえば、プロジェクトのすべてのソースセットに伝播される`*Main`ソースセットにKotlinコルーチン1.7.3の依存関係があるとします。
ただし、`iosTest`ソースセットでは、新しいライブラリリリースをテストするために、バージョンを1.8.0にアップグレードすることにしました。
同じアルゴリズムに従って、この依存関係は`*Test`ソースセットのツリー全体に伝播されるため、すべての`*Test`ソースセットは`kotlinx.coroutines-*:1.8.0`依存関係でコンパイルされます。

<img src="/img/test-main-source-set-dependency-alignment.svg" alt="Test source sets resolving dependencies separately from the main source sets" style={{verticalAlign: 'middle'}}/>

## コンパイル

シングルプラットフォームプロジェクトとは異なり、Kotlin Multiplatformプロジェクトでは、すべてのアートファクトをビルドするために複数のコンパイラ起動が必要です。各コンパイラ起動は、_Kotlinコンパイル_です。

たとえば、iPhoneデバイス用のバイナリが、前述のKotlinコンパイル中にどのように生成されるかを以下に示します。

<img src="/img/ios-compilation-diagram.svg" alt="Kotlin compilation for iOS" width="700" style={{verticalAlign: 'middle'}}/>

Kotlinコンパイルは、ターゲットの下にグループ化されます。デフォルトでは、Kotlinは各ターゲットに対して2つのコンパイルを作成します。1つはプロダクションソース用の`main`コンパイル、もう1つはテストソース用の`test`コンパイルです。

ビルドスクリプトのコンパイルには、同様の方法でアクセスします。最初にKotlinターゲットを選択し、
次に内部の`compilations`コンテナにアクセスし、最後に名前で必要なコンパイルを選択します。

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```