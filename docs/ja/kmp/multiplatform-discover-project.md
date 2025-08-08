[//]: # (title: Kotlinマルチプラットフォームプロジェクトの基本構造)

Kotlinマルチプラットフォームを使用すると、異なるプラットフォーム間でコードを共有できます。この記事では、共有コードの制約、共有コードとプラットフォーム固有のコード部分を区別する方法、およびこの共有コードが動作するプラットフォームを指定する方法について説明します。

また、共通コード (common code)、ターゲット (target)、プラットフォーム固有 (platform-specific) および中間ソースセット (intermediate source set)、テスト統合 (test integration) など、Kotlinマルチプラットフォームプロジェクトのセットアップに関するコアコンセプトも学習します。これにより、将来的にマルチプラットフォームプロジェクトをセットアップするのに役立ちます。

ここで提示するモデルは、Kotlinによって使用されているものと比較して簡略化されています。ただし、この基本的なモデルはほとんどの場合に十分であるはずです。

## 共通コード

_共通コード_ は、異なるプラットフォーム間で共有されるKotlinコードです。

簡単な「Hello, World」の例を考えてみましょう。

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

プラットフォーム間で共有されるKotlinコードは通常、`commonMain` ディレクトリに配置されます。コードファイルの場所は重要であり、このコードがコンパイルされるプラットフォームのリストに影響を与えます。

Kotlinコンパイラは、ソースコードを入力として受け取り、結果として一連のプラットフォーム固有のバイナリを生成します。マルチプラットフォームプロジェクトをコンパイルする場合、同じコードから複数のバイナリを生成できます。例えば、コンパイラは同じKotlinファイルからJVM `.class` ファイルとネイティブ実行可能ファイルを生成できます。

![Common code](common-code-diagram.svg){width=700}

すべてのKotlinコードがすべてのプラットフォームにコンパイルできるわけではありません。Kotlinコンパイラは、共通コードでプラットフォーム固有の関数やクラスを使用するのを防ぎます。これは、このコードが異なるプラットフォームにコンパイルできないためです。

例えば、共通コードから `java.io.File` の依存関係を使用することはできません。これはJDKの一部ですが、共通コードはネイティブコードにもコンパイルされ、そこではJDKクラスは利用できません。

![Unresolved Java reference](unresolved-java-reference.png){width=500}

共通コードでは、Kotlinマルチプラットフォームライブラリを使用できます。これらのライブラリは、異なるプラットフォームで異なる方法で実装できる共通のAPIを提供します。この場合、プラットフォーム固有のAPIは追加部分として機能し、共通コードでそのようなAPIを使用しようとするとエラーが発生します。

例えば、`kotlinx.coroutines` はすべてのターゲットをサポートするKotlinマルチプラットフォームライブラリですが、`fun CoroutinesDispatcher.asExecutor(): Executor` のように、`kotlinx.coroutines` の並行プリミティブをJDKの並行プリミティブに変換するプラットフォーム固有の部分も持っています。このAPIの追加部分は `commonMain` では利用できません。

## ターゲット

ターゲットは、Kotlinが共通コードをコンパイルするプラットフォームを定義します。これらは、例えばJVM、JS、Android、iOS、Linuxなどです。前の例では、共通コードをJVMターゲットとネイティブターゲットにコンパイルしました。

_Kotlinターゲット_ とは、コンパイルターゲットを記述する識別子です。これは、生成されるバイナリの形式、利用可能な言語構造、および許可される依存関係を定義します。

> ターゲットはプラットフォームとも呼ばれます。サポートされているターゲットの全リストについては、[こちら](multiplatform-dsl-reference.md#targets)を参照してください。
>
> {style="note"}

Kotlinに特定のターゲットのコードをコンパイルするように指示するには、まずターゲットを_宣言_する必要があります。Gradleでは、`kotlin {}` ブロック内で定義済みのDSL呼び出しを使用してターゲットを宣言します。

```kotlin
kotlin {
    jvm() // Declares a JVM target
    iosArm64() // Declares a target that corresponds to 64-bit iPhones
}
```

このようにして、各マルチプラットフォームプロジェクトはサポートされるターゲットのセットを定義します。ビルドスクリプトでのターゲットの宣言について詳しく知るには、[階層型プロジェクト構造](multiplatform-hierarchy.md)セクションを参照してください。

`jvm` と `iosArm64` のターゲットが宣言されると、`commonMain` の共通コードはこれらのターゲットにコンパイルされます。

![Targets](target-diagram.svg){width=700}

どのコードが特定のターゲットにコンパイルされるかを理解するために、ターゲットをKotlinソースファイルに付加されたラベルと考えることができます。Kotlinはこれらのラベルを使用して、コードをコンパイルする方法、生成するバイナリ、およびそのコードで許可される言語構造と依存関係を決定します。

`greeting.kt` ファイルも `.js` にコンパイルしたい場合は、JSターゲットを宣言するだけで済みます。`commonMain` のコードは、JSターゲットに対応する追加の `js` ラベルを受け取り、Kotlinに `.js` ファイルを生成するように指示します。

![Target labels](target-labels-diagram.svg){width=700}

これが、宣言されたすべてのターゲットにコンパイルされた共通コードでKotlinコンパイラが機能する方法です。プラットフォーム固有のコードの記述方法については、[ソースセット](#source-sets)を参照してください。

## ソースセット

_Kotlinソースセット_ とは、独自のターゲット、依存関係、およびコンパイラオプションを持つソースファイルのセットです。これは、マルチプラットフォームプロジェクトでコードを共有する主要な方法です。

マルチプラットフォームプロジェクトの各ソースセットは次のとおりです。

*   特定のプロジェクトに対して一意の名前を持ちます。
*   ソースファイルのセットとリソースを含み、通常はソースセット名と同じ名前のディレクトリに保存されます。
*   このソースセット内のコードがコンパイルされるターゲットのセットを指定します。
*   これらのターゲットは、このソースセットで利用可能な言語構造と依存関係に影響を与えます。
*   独自の依存関係とコンパイラオプションを定義します。

Kotlinは、事前に定義された多数のソースセットを提供します。その1つが `commonMain` であり、これはすべてのマルチプラットフォームプロジェクトに存在し、宣言されたすべてのターゲットにコンパイルされます。

Kotlinマルチプラットフォームプロジェクトでは、`src` 内のディレクトリとしてソースセットを操作します。例えば、`commonMain`、`iosMain`、`jvmMain` のソースセットを持つプロジェクトは、次の構造を持ちます。

![Shared sources](src-directory-diagram.png){width=350}

Gradleスクリプトでは、`kotlin.sourceSets {}` ブロック内で名前によってソースセットにアクセスします。

```kotlin
kotlin {
    // Targets declaration:
    // …

    // Source set declaration:
    sourceSets {
        commonMain {
            // Configure the commonMain source set
        }
    }
}
```

`commonMain` の他に、他のソースセットはプラットフォーム固有であるか、中間的なものかのいずれかです。

### プラットフォーム固有のソースセット

共通コードのみを持つことは便利ですが、常に可能であるとは限りません。`commonMain` のコードは宣言されたすべてのターゲットにコンパイルされ、Kotlinはそこでプラットフォーム固有のAPIを使用することを許可しません。

ネイティブターゲットとJSターゲットを持つマルチプラットフォームプロジェクトでは、`commonMain` の以下のコードはコンパイルされません。

```kotlin
// commonMain/kotlin/common.kt
// 共通コードではコンパイルされません
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

解決策として、Kotlinはプラットフォーム固有のソースセットを作成します。これはプラットフォームソースセットとも呼ばれます。各ターゲットには、そのターゲットのみにコンパイルされる対応するプラットフォームソースセットがあります。例えば、`jvm` ターゲットには、JVMのみにコンパイルされる対応する `jvmMain` ソースセットがあります。Kotlinはこれらのソースセットでプラットフォーム固有の依存関係を使用することを許可します。例えば、`jvmMain` ではJDKを使用できます。

```kotlin
// jvmMain/kotlin/jvm.kt
// `jvmMain` ソースセットではJavaの依存関係を使用できます
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 特定のターゲットへのコンパイル

特定のターゲットへのコンパイルは、複数のソースセットで機能します。Kotlinがマルチプラットフォームプロジェクトを特定のターゲットにコンパイルする場合、そのターゲットでラベル付けされたすべてのソースセットを収集し、それらからバイナリを生成します。

`jvm`、`iosArm64`、`js` ターゲットの例を考えてみましょう。Kotlinは共通コード用の `commonMain` ソースセットと、特定のターゲット用の対応する `jvmMain`、`iosArm64Main`、`jsMain` ソースセットを作成します。

![Compilation to a specific target](specific-target-diagram.svg){width=700}

JVMへのコンパイル中、Kotlinは「JVM」とラベル付けされたすべてのソースセット、つまり `jvmMain` と `commonMain` を選択します。その後、それらをまとめてJVMクラスファイルにコンパイルします。

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

Kotlinは `commonMain` と `jvmMain` をまとめてコンパイルするため、結果として生成されるバイナリには `commonMain` と `jvmMain` の両方からの宣言が含まれます。

マルチプラットフォームプロジェクトを扱う際には、以下の点を覚えておいてください。

*   コードを特定のプラットフォームにコンパイルしたい場合は、対応するターゲットを宣言します。
*   コードを保存するディレクトリまたはソースファイルを選択するには、まずどのターゲット間でコードを共有したいかを決定します。
    *   コードがすべてのターゲット間で共有される場合は、`commonMain` に宣言する必要があります。
    *   コードが1つのターゲットのみに使用される場合は、そのターゲット用のプラットフォーム固有のソースセット (例えば、JVMの場合は `jvmMain`) で定義する必要があります。
*   プラットフォーム固有のソースセットで書かれたコードは、共通ソースセットからの宣言にアクセスできます。
*   例えば、`jvmMain` のコードは `commonMain` のコードを使用できます。しかし、その逆は真ではありません: `commonMain` は `jvmMain` のコードを使用できません。
*   プラットフォーム固有のソースセットで書かれたコードは、対応するプラットフォームの依存関係を使用できます。
*   例えば、`jvmMain` のコードは、[Guava](https://github.com/google/guava) や [Spring](https://spring.io/) のようなJava専用のライブラリを使用できます。

### 中間ソースセット

シンプルなマルチプラットフォームプロジェクトは通常、共通コードとプラットフォーム固有のコードのみを持ちます。`commonMain` ソースセットは、宣言されたすべてのターゲット間で共有される共通コードを表します。`jvmMain` のようなプラットフォーム固有のソースセットは、それぞれのターゲットのみにコンパイルされるプラットフォーム固有のコードを表します。

実際には、より詳細なコード共有が必要になることがよくあります。

すべての最新のAppleデバイスとAndroidデバイスをターゲットにする必要がある例を考えてみましょう。

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64-bit iPhone devices
    macosArm64() // Modern Apple Silicon-based Macs
    watchosX64() // Modern 64-bit Apple Watch devices
    tvosArm64()  // Modern Apple TV devices  
}
```

そして、すべてのAppleデバイス用のUUIDを生成する関数を追加するためのソースセットが必要です。

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // Apple固有のAPIにアクセスしたい
    return NSUUID().UUIDString()
}
```

この関数を `commonMain` に追加することはできません。`commonMain` はAndroidを含む宣言されたすべてのターゲットにコンパイルされますが、`platform.Foundation.NSUUID` はApple固有のAPIであり、Androidでは利用できません。`commonMain` で `NSUUID` を参照しようとすると、Kotlinはエラーを表示します。

このコードを各Apple固有のソースセット: `iosArm64Main`、`macosArm64Main`、`watchosX64Main`、`tvosArm64Main` にコピー＆ペーストすることもできます。しかし、このようなコードの重複はエラーの原因となるため、このアプローチは推奨されません。

この問題を解決するには、_中間ソースセット (intermediate source set)_ を使用できます。中間ソースセットは、プロジェクト内のすべてのターゲットではなく、一部のターゲットにコンパイルされるKotlinソースセットです。中間ソースセットは、階層型ソースセット (hierarchical source set) または単に階層 (hierarchy) と呼ばれることもあります。

Kotlinはデフォルトでいくつかの中間ソースセットを作成します。この特定のケースでは、結果として得られるプロジェクト構造は次のようになります。

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

ここで、下部の多色のブロックはプラットフォーム固有のソースセットです。明確にするために、ターゲットラベルは省略されています。

`appleMain` ブロックは、Apple固有のターゲットにコンパイルされるコードを共有するためにKotlinによって作成された中間ソースセットです。`appleMain` ソースセットはAppleターゲットのみにコンパイルされます。したがって、Kotlinは `appleMain` でApple固有のAPIを使用することを許可し、ここで `randomUUID()` 関数を追加できます。

> Kotlinがデフォルトで作成および設定するすべての中間ソースセットを見つけるには[階層型プロジェクト構造](multiplatform-hierarchy.md)を参照してください。また、Kotlinがデフォルトで必要な中間ソースセットを提供しない場合にどうすべきかを学習できます。
>
{style="tip"}

特定のターゲットへのコンパイル中、Kotlinはこのターゲットでラベル付けされた中間ソースセットを含むすべてのソースセットを取得します。したがって、`commonMain`、`appleMain`、`iosArm64Main` のソースセットに書かれたすべてのコードは、`iosArm64` プラットフォームターゲットへのコンパイル中に結合されます。

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 一部のソースセットにソースがなくても問題ありません。例えば、iOS開発では通常、iOSデバイス固有であるがiOSシミュレータ固有ではないコードを提供する必要はありません。したがって、`iosArm64Main` はほとんど使用されません。
>
{style="tip"}

#### Appleデバイスとシミュレータのターゲット {initial-collapse-state="collapsed" collapsible="true"}

Kotlinマルチプラットフォームを使用してiOSモバイルアプリケーションを開発する場合、通常は `iosMain` ソースセットを使用します。`ios` ターゲットのプラットフォーム固有のソースセットだと考えるかもしれませんが、単一の `ios` ターゲットは存在しません。ほとんどのモバイルプロジェクトでは、少なくとも2つのターゲットが必要です。

*   **デバイスターゲット**は、iOSデバイスで実行できるバイナリを生成するために使用されます。現在、iOS用のデバイスターゲットは1つだけです: `iosArm64`。
*   **シミュレータターゲット**は、マシン上で起動されるiOSシミュレータ用のバイナリを生成するために使用されます。Apple Silicon搭載のMacコンピュータをお持ちの場合は、`iosSimulatorArm64` をシミュレータターゲットとして選択してください。IntelベースのMacコンピュータをお持ちの場合は、`iosX64` を使用してください。

`iosArm64` デバイスターゲットのみを宣言した場合、ローカルマシンでアプリケーションとテストを実行およびデバッグすることはできません。

`iosArm64Main`、`iosSimulatorArm64Main`、`iosX64Main` のようなプラットフォーム固有のソースセットは通常、空です。これは、iOSデバイスとシミュレータ用のKotlinコードが通常同じであるためです。それらすべてでコードを共有するために、`iosMain` 中間ソースセットのみを使用できます。

同じことが他のMac以外のAppleターゲットにも当てはまります。例えば、Apple TV用の `tvosArm64` デバイスターゲットと、Apple SiliconおよびIntelベースのデバイス上のApple TVシミュレータ用の `tvosSimulatorArm64` および `tvosX64` シミュレータターゲットがある場合、それらすべてに `tvosMain` 中間ソースセットを使用できます。

## テストとの統合

実際のプロジェクトでは、メインのプロダクションコード (production code) とともにテストも必要です。このため、デフォルトで作成されるすべてのソースセットには `Main` と `Test` のサフィックスが付けられています。`Main` はプロダクションコードを含み、`Test` はこのコードのテストを含みます。それらの間の接続は自動的に確立され、テストは追加の設定なしで `Main` コードによって提供されるAPIを使用できます。

`Test` の対応物も `Main` と同様のソースセットです。例えば、`commonTest` は `commonMain` の対応物であり、宣言されたすべてのターゲットにコンパイルされ、共通テストを記述できます。`jvmTest` のようなプラットフォーム固有のテストソースセットは、プラットフォーム固有のテスト、例えばJVM固有のテストやJVM APIを必要とするテストを記述するために使用されます。

共通テストを記述するためのソースセットを持つだけでなく、マルチプラットフォームテストフレームワークも必要です。Kotlinは、`@kotlin.Test` アノテーションや `assertEquals`、`assertTrue` などのさまざまなアサーションメソッド (assertion method) を備えたデフォルトの [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) ライブラリを提供します。

各プラットフォームのそれぞれのソースセットで、通常のテストと同様にプラットフォーム固有のテストを記述できます。メインコードと同様に、各ソースセットにはプラットフォーム固有の依存関係を持つことができます。例えば、JVMには `JUnit`、iOSには `XCTest` です。特定のターゲットのテストを実行するには、`<targetName>Test` タスクを使用します。

マルチプラットフォームテストを作成および実行する方法については、[マルチプラットフォームアプリのテストチュートリアル](multiplatform-run-tests.md)で学習してください。

## 次のステップ

*   [Gradleスクリプトで事前定義されたソースセットを宣言して使用する方法について詳しく学ぶ](multiplatform-hierarchy.md)
*   [マルチプラットフォームプロジェクト構造の高度な概念を探る](multiplatform-advanced-project-structure.md)
*   [ターゲットコンパイルとカスタムコンパイルの作成について詳しく学ぶ](multiplatform-configure-compilations.md)