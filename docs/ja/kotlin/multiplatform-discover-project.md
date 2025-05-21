---
title: "Kotlin Multiplatform プロジェクト構造の基本"
---
Kotlin Multiplatformを使用すると、異なるプラットフォーム間でコードを共有できます。この記事では、共有コードの制約、コードの共有部分とプラットフォーム固有の部分を区別する方法、およびこの共有コードが動作するプラットフォームを指定する方法について説明します。

また、共通コード、[target (ターゲット)](multiplatform-dsl-reference#targets)、プラットフォーム固有および中間[source set (ソースセット)]、テストの統合など、Kotlin Multiplatformプロジェクトのセットアップの中核となる概念についても学習します。これらは、将来のマルチプラットフォームプロジェクトのセットアップに役立ちます。

ここで紹介するモデルは、Kotlinで使用されているものと比較して簡略化されています。ただし、この基本的なモデルは、ほとんどの場合に十分であるはずです。

## 共通コード

_共通コード_とは、異なるプラットフォーム間で共有されるKotlinコードのことです。

簡単な「Hello, World」の例を考えてみましょう。

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

プラットフォーム間で共有されるKotlinコードは、通常、`commonMain`ディレクトリに配置されます。コードファイルの場所は重要です。これは、このコードがコンパイルされるプラットフォームのリストに影響を与えるためです。

Kotlinコンパイラは、ソースコードを入力として受け取り、プラットフォーム固有のバイナリのセットを結果として生成します。マルチプラットフォームプロジェクトをコンパイルする場合、同じコードから複数のバイナリを生成できます。たとえば、コンパイラは、同じKotlinファイルからJVM `.class`ファイルとネイティブ実行可能ファイルを生成できます。

<img src="/img/common-code-diagram.svg" alt="共通コード" width="700" style={{verticalAlign: 'middle'}}/>

すべてのKotlinコードをすべてのプラットフォームにコンパイルできるわけではありません。Kotlinコンパイラは、共通コードでプラットフォーム固有の関数またはクラスを使用することを防ぎます。これは、このコードを別のプラットフォームにコンパイルできないためです。

たとえば、共通コードから`java.io.File`依存関係を使用することはできません。これはJDKの一部ですが、共通コードはネイティブコードにもコンパイルされ、JDKクラスは利用できません。

<img src="/img/unresolved-java-reference.png" alt="未解決のJava参照" width="500" style={{verticalAlign: 'middle'}}/>

共通コードでは、Kotlin Multiplatformライブラリを使用できます。これらのライブラリは、異なるプラットフォームで異なる方法で実装できる共通APIを提供します。この場合、プラットフォーム固有のAPIは追加の部分として機能し、共通コードでそのようなAPIを使用しようとするとエラーが発生します。

たとえば、`kotlinx.coroutines`は、すべての[target (ターゲット)]をサポートするKotlin Multiplatformライブラリですが、`kotlinx.coroutines`並行プリミティブをJDK並行プリミティブに変換するプラットフォーム固有の部分も含まれています。たとえば、`fun CoroutinesDispatcher.asExecutor(): Executor`などです。APIのこの追加部分は、`commonMain`では使用できません。

## [Target (ターゲット)]

[Target (ターゲット)]は、Kotlinが共通コードをコンパイルするプラットフォームを定義します。これには、たとえば、JVM、JS、Android、iOS、またはLinuxが含まれます。前の例では、共通コードをJVMとネイティブ[target (ターゲット)]にコンパイルしました。

_Kotlin [target (ターゲット)]_とは、コンパイル[target (ターゲット)]を記述する識別子です。生成されるバイナリの形式、利用可能な言語構造、および許可される依存関係を定義します。

:::tip
[Target (ターゲット)]は、プラットフォームと呼ばれることもあります。サポートされている[target (ターゲット)]の完全な[list (リスト)](multiplatform-dsl-reference#targets)を参照してください。

まず、特定の[target (ターゲット)]に対してコードをコンパイルするようにKotlinに指示するために、[target (ターゲット)]を_宣言_する必要があります。Gradleでは、`kotlin {}`ブロック内で定義済みのDSL呼び出しを使用して[target (ターゲット)]を宣言します。

```kotlin
kotlin {
    jvm() // JVM [target (ターゲット)]を宣言します
    iosArm64() // 64ビットiPhoneに対応する[target (ターゲット)]を宣言します
}
```

このようにして、各マルチプラットフォームプロジェクトは、サポートされている[target (ターゲット)]のセットを定義します。ビルドスクリプトで[target (ターゲット)]を宣言する方法の詳細については、[Hierarchical project structure (階層型プロジェクト構造)](multiplatform-hierarchy)セクションを参照してください。

`jvm`と`iosArm64`[target (ターゲット)]が宣言されると、`commonMain`の共通コードはこれらの[target (ターゲット)]にコンパイルされます。

<img src="/img/target-diagram.svg" alt="ターゲット" width="700" style={{verticalAlign: 'middle'}}/>

どのコードが特定の[target (ターゲット)]にコンパイルされるかを理解するために、[target (ターゲット)]をKotlinソースファイルにアタッチされたラベルと考えることができます。Kotlinは、これらのラベルを使用して、コードのコンパイル方法、生成するバイナリ、およびそのコードで許可される言語構造と依存関係を決定します。

`greeting.kt`ファイルを`.js`にもコンパイルする場合は、JS[target (ターゲット)]を宣言するだけです。次に、`commonMain`のコードは、JS[target (ターゲット)]に対応する追加の`js`ラベルを受け取ります。これにより、Kotlinに`.js`ファイルを生成するように指示します。

<img src="/img/target-labels-diagram.svg" alt="targetラベル" width="700" style={{verticalAlign: 'middle'}}/>

これが、Kotlinコンパイラがすべての宣言された[target (ターゲット)]にコンパイルされた共通コードで動作する方法です。プラットフォーム固有のコードを記述する方法については、[Source sets (ソースセット)](#source-sets)を参照してください。

## [Source sets (ソースセット)]

_Kotlin [source set (ソースセット)]_とは、独自の[target (ターゲット)]、依存関係、およびコンパイラオプションを持つソースファイルのセットです。これは、マルチプラットフォームプロジェクトでコードを共有する主な方法です。

マルチプラットフォームプロジェクトの各[source set (ソースセット)]：

* 特定のプロジェクトに対して一意の名前を持ちます。
* 通常、[source set (ソースセット)]の名前のディレクトリに格納されているソースファイルとリソースのセットが含まれています。
* この[source set (ソースセット)]のコードがコンパイルされる[target (ターゲット)]のセットを指定します。これらの[target (ターゲット)]は、この[source set (ソースセット)]で使用できる言語構造と依存関係に影響を与えます。
* 独自の依存関係とコンパイラオプションを定義します。

Kotlinは、事前に定義された[source set (ソースセット)]を多数提供します。その1つが`commonMain`です。これは、すべてのマルチプラットフォームプロジェクトに存在し、宣言されたすべての[target (ターゲット)]にコンパイルされます。

Kotlin Multiplatformプロジェクトでは、`src`内のディレクトリとして[source set (ソースセット)]を操作します。たとえば、`commonMain`、`iosMain`、および`jvmMain`[source set (ソースセット)]を持つプロジェクトは、次の構造を持ちます。

<img src="/img/src-directory-diagram.png" alt="共有ソース" width="350" style={{verticalAlign: 'middle'}}/>

Gradleスクリプトでは、`kotlin.sourceSets {}`ブロック内で名前で[source set (ソースセット)]にアクセスします。

```kotlin
kotlin {
    // ターゲット宣言:
    // …

    // ソースセット宣言:
    sourceSets {
        commonMain {
            // commonMainソースセットを構成します
        }
    }
}
```

`commonMain`とは別に、他の[source set (ソースセット)]は、プラットフォーム固有または中間です。

### プラットフォーム固有の[source set (ソースセット)]

共通コードのみを持つことは便利ですが、常に可能とは限りません。`commonMain`のコードは、宣言されたすべての[target (ターゲット)]にコンパイルされ、Kotlinでは、そこにプラットフォーム固有のAPIを使用することはできません。

ネイティブおよびJS[target (ターゲット)]を持つマルチプラットフォームプロジェクトでは、`commonMain`の次のコードはコンパイルされません。

```kotlin
// commonMain/kotlin/common.kt
// 共通コードではコンパイルされません
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

解決策として、Kotlinはプラットフォーム固有の[source set (ソースセット)]を作成します。これは、プラットフォーム[source set (ソースセット)]とも呼ばれます。各[target (ターゲット)]には、その[target (ターゲット)]に対してのみコンパイルされる対応するプラットフォーム[source set (ソースセット)]があります。たとえば、`jvm`[target (ターゲット)]には、JVMに対してのみコンパイルされる対応する`jvmMain`[source set (ソースセット)]があります。Kotlinでは、これらの[source set (ソースセット)]でプラットフォーム固有の依存関係を使用できます。たとえば、`jvmMain`ではJDKを使用できます。

```kotlin
// jvmMain/kotlin/jvm.kt
// `jvmMain`ソースセットではJava依存関係を使用できます
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 特定の[target (ターゲット)]へのコンパイル

特定の[target (ターゲット)]へのコンパイルは、複数の[source set (ソースセット)]で動作します。Kotlinがマルチプラットフォームプロジェクトを特定の[target (ターゲット)]にコンパイルする場合、この[target (ターゲット)]でラベル付けされたすべての[source set (ソースセット)]を収集し、それらからバイナリを生成します。

`jvm`、`iosArm64`、および`js`[target (ターゲット)]の例を考えてみましょう。Kotlinは、共通コード用の`commonMain`[source set (ソースセット)]と、特定の[target (ターゲット)]用の対応する`jvmMain`、`iosArm64Main`、および`jsMain`[source set (ソースセット)]を作成します。

<img src="/img/specific-target-diagram.svg" alt="特定のターゲットへのコンパイル" width="700" style={{verticalAlign: 'middle'}}/>

JVMへのコンパイル中、Kotlinは「JVM」でラベル付けされたすべての[source set (ソースセット)]、つまり`jvmMain`と`commonMain`を選択します。次に、それらをまとめてJVMクラスファイルにコンパイルします。

<img src="/img/compilation-jvm-diagram.svg" alt="JVMへのコンパイル" width="700" style={{verticalAlign: 'middle'}}/>

Kotlinは`commonMain`と`jvmMain`を一緒にコンパイルするため、結果のバイナリには`commonMain`と`jvmMain`の両方の宣言が含まれます。

マルチプラットフォームプロジェクトを操作する場合は、次の点に注意してください。

* コードを特定のプラットフォームにコンパイルする場合は、対応する[target (ターゲット)]を宣言します。
* コードを保存するディレクトリまたはソースファイルを選択するには、まず、どの[target (ターゲット)]間でコードを共有するかを決定します。

    * コードがすべての[target (ターゲット)]間で共有されている場合は、`commonMain`で宣言する必要があります。
    * コードが1つの[target (ターゲット)]でのみ使用される場合は、その[target (ターゲット)]のプラットフォーム固有の[source set (ソースセット)]で定義する必要があります（たとえば、JVMの場合は`jvmMain`）。
* プラットフォーム固有の[source set (ソースセット)]で記述されたコードは、共通[source set (ソースセット)]からの宣言にアクセスできます。たとえば、`jvmMain`のコードは`commonMain`のコードを使用できます。ただし、逆は当てはまりません。`commonMain`は`jvmMain`のコードを使用できません。
* プラットフォーム固有の[source set (ソースセット)]で記述されたコードは、対応するプラットフォーム依存関係を使用できます。たとえば、`jvmMain`のコードは、[Guava](https://github.com/google/guava)や[Spring](https://spring.io/)などのJavaのみのライブラリを使用できます。

### 中間の[source set (ソースセット)]

単純なマルチプラットフォームプロジェクトには、通常、共通コードとプラットフォーム固有のコードのみが含まれます。`commonMain`[source set (ソースセット)]は、宣言されたすべての[target (ターゲット)]間で共有される共通コードを表します。`jvmMain`などのプラットフォーム固有の[source set (ソースセット)]は、それぞれの[target (ターゲット)]に対してのみコンパイルされるプラットフォーム固有のコードを表します。

実際には、よりきめ細かいコード共有が必要になることがよくあります。

すべての最新のAppleデバイスとAndroidデバイスを[target (ターゲット)]にする必要がある例を考えてみましょう。

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64ビットiPhoneデバイス
    macosArm64() // 最新のAppleシリコンベースのMac
    watchosX64() // 最新の64ビットApple Watchデバイス
    tvosArm64()  // 最新のApple TVデバイス  
}
```

また、すべてのAppleデバイスのUUIDを生成する関数を追加する[source set (ソースセット)]が必要です。

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // Apple固有のAPIにアクセスする必要があります
    return NSUUID().UUIDString()
}
```

この関数を`commonMain`に追加することはできません。`commonMain`は、Androidを含む、宣言されたすべての[target (ターゲット)]にコンパイルされますが、`platform.Foundation.NSUUID`は、Androidでは利用できないApple固有のAPIです。`commonMain`で`NSUUID`を参照しようとすると、Kotlinはエラーを表示します。

このコードを各Apple固有の[source set (ソースセット)]：`iosArm64Main`、`macosArm64Main`、`watchosX64Main`、および`tvosArm64Main`にコピーアンドペーストできます。ただし、このようなコードの複製はエラーが発生しやすいため、このアプローチは推奨されません。

この問題を解決するには、_中間[source set (ソースセット)]_を使用できます。中間[source set (ソースセット)]は、プロジェクト内の一部の[target (ターゲット)]にコンパイルされるKotlin [source set (ソースセット)]ですが、すべてではありません。中間[source set (ソースセット)]は、階層型[source set (ソースセット)]または単に階層と呼ばれることもあります。

Kotlinは、デフォルトでいくつかの中間[source set (ソースセット)]を作成します。この特定のケースでは、結果のプロジェクト構造は次のようになります。

<img src="/img/intermediate-source-sets-diagram.svg" alt="中間ソースセット" width="700" style={{verticalAlign: 'middle'}}/>

ここで、下部にある多色のブロックはプラットフォーム固有の[source set (ソースセット)]です。わかりやすくするために、[target (ターゲット)]ラベルは省略されています。

`appleMain`ブロックは、Apple固有の[target (ターゲット)]にコンパイルされるコードを共有するためにKotlinによって作成された中間[source set (ソースセット)]です。`appleMain`[source set (ソースセット)]は、Apple [target (ターゲット)]に対してのみコンパイルされます。したがって、Kotlinでは`appleMain`でApple固有のAPIを使用でき、ここに`randomUUID()`関数を追加できます。

Kotlinがデフォルトで作成およびセットアップするすべての中間[source set (ソースセット)]を見つけるには、[Hierarchical project structure (階層型プロジェクト構造)](multiplatform-hierarchy)を参照し、Kotlinがデフォルトで必要な中間[source set (ソースセット)]を提供しない場合に何をすべきかを学びます。

:::

特定の[target (ターゲット)]へのコンパイル中、Kotlinは、この[target (ターゲット)]でラベル付けされたすべての中間[source set (ソースセット)]を含む、すべての[source set (ソースセット)]を取得します。したがって、`commonMain`、`appleMain`、および`iosArm64Main`[source set (ソースセット)]に記述されたすべてのコードは、`iosArm64`プラットフォーム[target (ターゲット)]へのコンパイル中に結合されます。

<img src="/img/native-executables-diagram.svg" alt="ネイティブ実行可能ファイル" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
一部の[source set (ソースセット)]にソースがない場合でも問題ありません。たとえば、iOS開発では、iOSデバイス固有であるがiOSシミュレーターにはないコードを提供する必要は通常ありません。したがって、`iosArm64Main`が使用されることはほとんどありません。

:::

#### Appleデバイスとシミュレーターの[target (ターゲット)]

Kotlin Multiplatformを使用してiOSモバイルアプリケーションを開発する場合、通常は`iosMain`[source set (ソースセット)]を使用します。`ios`[target (ターゲット)]のプラットフォーム固有の[source set (ソースセット)]と思われるかもしれませんが、単一の`ios`[target (ターゲット)]はありません。ほとんどのモバイルプロジェクトでは、少なくとも2つの[target (ターゲット)]が必要です。

* **デバイス[target (ターゲット)]**は、iOSデバイスで実行できるバイナリを生成するために使用されます。現在、iOSのデバイス[target (ターゲット)]は1つだけです：`iosArm64`。
* **シミュレーター[target (ターゲット)]**は、マシンで起動されたiOSシミュレーター用のバイナリを生成するために使用されます。AppleシリコンMacコンピューターをお持ちの場合は、シミュレーター[target (ターゲット)]として`iosSimulatorArm64`を選択します。IntelベースのMacコンピューターをお持ちの場合は、`iosX64`を使用します。

`iosArm64`デバイス[target (ターゲット)]のみを宣言した場合、ローカルマシンでアプリケーションとテストを実行およびデバッグすることはできません。

`iosArm64Main`、`iosSimulatorArm64Main`、および`iosX64Main`のようなプラットフォーム固有の[source set (ソースセット)]は通常空です。iOSデバイスとシミュレーター用のKotlinコードは通常同じであるためです。それらすべてでコードを共有するには、`iosMain`中間[source set (ソースセット)]のみを使用できます。

これは、Mac以外の他のApple [target (ターゲット)]にも当てはまります。たとえば、Apple TV用の`tvosArm64`デバイス[target (ターゲット)]と、AppleシリコンおよびIntelベースのデバイス上のApple TVシミュレーター用の`tvosSimulatorArm64`および`tvosX64`シミュレーター[target (ターゲット)]がある場合、それらすべてに`tvosMain`中間[source set (ソースセット)]を使用できます。

## テストとの統合

実際のプロジェクトでは、メインのプロダクションコードとともにテストも必要です。これが、デフォルトで作成されるすべての[source set (ソースセット)]に`Main`と`Test`のサフィックスが付いている理由です。`Main`にはプロダクションコードが含まれ、`Test`にはこのコードのテストが含まれています。それらの間の接続は自動的に確立され、テストは追加の構成なしに`Main`コードによって提供されるAPIを使用できます。

`Test`の対応物は、`Main`と同様の[source set (ソースセット)]でもあります。たとえば、`commonTest`は`commonMain`の対応物であり、宣言されたすべての[target (ターゲット)]にコンパイルされるため、共通テストを記述できます。`jvmTest`などのプラットフォーム固有のテスト[source set (ソースセット)]は、プラットフォーム固有のテスト（たとえば、JVM固有のテスト、またはJVM APIを必要とするテスト）を記述するために使用されます。

共通テストを記述するための[source set (ソースセット)]を用意するだけでなく、マルチプラットフォームテストフレームワークも必要です。Kotlinは、`@kotlin.Test`アノテーションと`assertEquals`や`assertTrue`などのさまざまなアサーションメソッドが付属するデフォルトの[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリを提供します。

各プラットフォームの通常のテストのように、それぞれの[source set (ソースセット)]でプラットフォーム固有のテストを記述できます。メインコードと同様に、各[source set (ソースセット)]にプラットフォーム固有の依存関係（JVMの場合は`JUnit`、iOSの場合は`XCTest`など）を含めることができます。特定の[target (ターゲット)]のテストを実行するには、`<targetName>Test`タスクを使用します。

マルチプラットフォームテストを作成および実行する方法については、[Test your multiplatform app tutorial (マルチプラットフォームアプリのテストチュートリアル)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)を参照してください。

## 次のステップ

* [Gradleスクリプトでの定義済みの[source set (ソースセット)]の宣言と使用について詳しくはこちら](multiplatform-hierarchy)
* [マルチプラットフォームプロジェクト構造の高度な概念を調べてみましょう](multiplatform-advanced-project-structure)
* [[Target (ターゲット)]のコンパイルとカスタムコンパイルの作成について詳しくはこちら](multiplatform-configure-compilations)