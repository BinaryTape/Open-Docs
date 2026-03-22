[//]: # (title: Kotlin 1.9.0 の新機能)

<web-summary>Kotlin 1.9.0 のリリースノートを読み、新しい言語機能、Kotlin Multiplatform、JVM、Native、JS、および Wasm のアップデート、Gradle および Maven のビルドツールサポートについて確認してください。</web-summary>

_[リリース日: 2023年7月6日](releases.md#release-history)_

Kotlin 1.9.0 リリースが公開されました。JVM 用の K2 コンパイラが **ベータ（Beta）** になりました。さらに、主なハイライトは以下の通りです：

* [新しい Kotlin K2 コンパイラのアップデート](#new-kotlin-k2-compiler-updates)
* [enum クラスの values 関数の Stable な代替](#stable-replacement-of-the-enum-class-values-function)
* [オープンエンドのレンジ（open-ended ranges）用の Stable な `..<` 演算子](#stable-operator-for-open-ended-ranges)
* [名前で正規表現のキャプチャグループを取得する新しい共通関数](#new-common-function-to-get-regex-capture-group-by-name)
* [親ディレクトリを作成する新しいパスユーティリティ](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform における Gradle 設定キャッシュ（configuration cache）のプレビュー](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform における Android ターゲットサポートの変更](#changes-to-android-target-support)
* [Kotlin/Native におけるカスタムメモリキーアロケータのプレビュー](#preview-of-custom-memory-allocator)
* [Kotlin/Native におけるライブラリのリンケージ](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm におけるサイズ関連の最適化](#size-related-optimizations)

この動画でもアップデートの短い概要をご覧いただけます：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

> Kotlin のリリースサイクルの詳細については、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

1.9.0 をサポートする Kotlin プラグインは以下で利用可能です：

| IDE | サポートされているバージョン |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 プラグインは、Android Studio Giraffe (223) および Hedgehog (231) の今後のリリースに含まれる予定です。

Kotlin 1.9.0 プラグインは、IntelliJ IDEA 2023.2 の今後のリリースに含まれる予定です。

> Kotlin のアーティファクトと依存関係をダウンロードするには、[Gradle の設定を構成](#configure-gradle-settings)して Maven Central リポジトリを使用するようにしてください。
>
{style="warning"}

## 新しい Kotlin K2 コンパイラのアップデート

JetBrains の Kotlin チームは K2 コンパイラの安定化を続けており、1.9.0 リリースではさらなる進歩が導入されました。
JVM 用の K2 コンパイラは現在 **ベータ（Beta）** です。

また、Kotlin/Native およびマルチプラットフォームプロジェクトの基本的なサポートも追加されました。

### kapt コンパイラプラグインと K2 コンパイラの互換性

プロジェクトで [kapt プラグイン](kapt.md)を K2 コンパイラと併用できますが、いくつかの制限があります。
`languageVersion` を `2.0` に設定しても、kapt コンパイラプラグインは引き続き古いコンパイラを利用します。

`languageVersion` が `2.0` に設定されているプロジェクトで kapt コンパイラプラグインを実行すると、kapt は自動的に `1.9` に切り替わり、特定のバージョン互換性チェックを無効にします。この動作は、次のコマンド引数を含めるのと同等です：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

これらのチェックは kapt タスクに対してのみ無効化されます。他のすべてのコンパイルタスクは、引き続き新しい K2 コンパイラを利用します。

K2 コンパイラで kapt を使用する際に問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### プロジェクトで K2 コンパイラを試す

1.9.0 から Kotlin 2.0 のリリースまでの間、`gradle.properties` ファイルに `kotlin.experimental.tryK2=true` Gradle プロパティを追加することで、簡単に K2 コンパイラをテストできます。また、次のコマンドを実行することもできます：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

この Gradle プロパティは自動的に言語バージョンを 2.0 に設定し、現在のコンパイラと比較して K2 コンパイラを使用してコンパイルされた Kotlin タスクの数でビルドレポートを更新します：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle ビルドレポート

[Gradle ビルドレポート](gradle-compilation-and-caches.md#build-reports)に、コードのコンパイルに現在のコンパイラと K2 コンパイラのどちらが使用されたかが表示されるようになりました。Kotlin 1.9.0 では、この情報を [Gradle ビルドスキャン](https://scans.gradle.com/)で確認できます：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

また、ビルドレポート内でプロジェクトで使用されている Kotlin バージョンを直接確認することもできます：

```none
Task info:
  Kotlin language version: 1.9
```

> Gradle 8.0 を使用している場合、特に Gradle の設定キャッシュ（configuration caching）が有効なときに、ビルドレポートに問題が発生することがあります。これは既知の問題であり、Gradle 8.1 以降で修正されています。
>
{style="note"}

### 現在の K2 コンパイラの制限事項

Gradle プロジェクトで K2 を有効にすると、Gradle バージョン 8.3 未満を使用しているプロジェクトにおいて、以下の場合に制限が生じる可能性があります：

* `buildSrc` からのソースコードのコンパイル。
* インクルードされたビルド（included builds）での Gradle プラグインのコンパイル。
* Gradle 8.3 未満のプロジェクトで使用されている場合の、他の Gradle プラグインのコンパイル。
* Gradle プラグインの依存関係のビルド。

上記の問題のいずれかに遭遇した場合は、以下の手順で対処できます：

* `buildSrc`、Gradle プラグイン、およびその依存関係の言語バージョンを設定します：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* プロジェクトの Gradle バージョンを、利用可能になった時点で 8.3 に更新します。

### 新しい K2 コンパイラへのフィードバックをお寄せください

皆様からのフィードバックをお待ちしております。

* Kotlin の Slack で直接 K2 開発者にフィードバックを提供してください – [招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラで直面した問題は、[課題トラッカー](https://kotl.in/issue)に報告してください。
* [**Send usage statistics（使用統計の送信）** オプションを有効](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)にして、JetBrains が K2 の使用に関する匿名データを収集できるようにしてください。

## 言語

Kotlin 1.9.0 では、以前に導入されたいくつかの新しい言語機能が Stable になります：
* [enum クラスの values 関数の代替](#stable-replacement-of-the-enum-class-values-function)
* [data クラスとの対称性のための data object](#stable-data-objects-for-symmetry-with-data-classes)
* [インライン値クラス（inline value classes）における本体を持つ二次コンストラクタのサポート](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum クラスの values 関数の Stable な代替

1.8.20 では、enum クラスの `entries` プロパティが試験的（Experimental）な機能として導入されました。`entries` プロパティは、合成関数 `values()` に代わる、モダンでパフォーマンスの高い代替手段です。1.9.0 では、`entries` プロパティが Stable になりました。

> `values()` 関数は引き続きサポートされますが、代わりに `entries` プロパティを使用することをお勧めします。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

enum クラスの `entries` プロパティの詳細については、[Kotlin 1.8.20 の新機能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)を参照してください。

### data クラスとの対称性のための Stable な data object

[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) で導入された data object 宣言が Stable になりました。これには、data クラスとの対称性のために追加された関数 `toString()`、`equals()`、および `hashCode()` も含まれます。

この機能は、`sealed` 階層（`sealed class` や `sealed interface` の階層など）で特に有用です。なぜなら、`data object` 宣言は `data class` 宣言と一緒に便利に使用できるからです。この例では、`EndOfFile` を単なる `object` ではなく `data object` として宣言することで、手動でオーバーライドしなくても自動的に `toString()` 関数を持つことになります。これにより、付随する data クラスの定義との対称性が維持されます。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{validate="false"}

詳細については、[Kotlin 1.8.20 の新機能](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)を参照してください。

### インライン値クラスにおける本体を持つ二次コンストラクタのサポート

Kotlin 1.9.0 以降、[インライン値クラス（inline value classes）](inline-classes.md)での本体を持つ二次コンストラクタの使用がデフォルトで利用可能になりました：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30 以降許可:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Kotlin 1.9.0 以降デフォルトで許可:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前、Kotlin はインラインクラスにおいて公開されたプライマリコンストラクタのみを許可していました。その結果、基礎となる値をカプセル化したり、何らかの制約された値を表すインラインクラスを作成したりすることが不可能でした。

Kotlin の発展に伴い、これらの問題は修正されました。Kotlin 1.4.30 で `init` ブロックの制限が解除され、その後 Kotlin 1.8.20 で本体を持つ二次コンストラクタのプレビューが導入されました。それらが現在、デフォルトで利用可能になっています。Kotlin インラインクラスの開発の詳細については、[こちらの KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) を参照してください。

## Kotlin/JVM

バージョン 1.9.0 以降、コンパイラは JVM 20 に対応するバイトコードバージョンのクラスを生成できるようになりました。さらに、`JvmDefault` アノテーションとレガシーな `-Xjvm-default` モードの非推奨化が継続されています。

### JvmDefault アノテーションとレガシーな -Xjvm-default モードの非推奨化

Kotlin 1.5 以降、新しい `-Xjvm-default` モード（`all` および `all-compatibility`）の導入に伴い、`JvmDefault` アノテーションの使用は非推奨となりました。Kotlin 1.4 での `JvmDefaultWithoutCompatibility` および Kotlin 1.6 での `JvmDefaultWithCompatibility` の導入により、これらのモードは `DefaultImpls` クラスの生成を包括的に制御し、古い Kotlin コードとのシームレスな互換性を確保します。

その結果、Kotlin 1.9.0 では `JvmDefault` アノテーションはもはや意味を持たず、非推奨（deprecated）としてマークされ、エラーが発生するようになりました。最終的には Kotlin から削除される予定です。

## Kotlin/Native

その他の改善点に加え、このリリースでは [Kotlin/Native メモリマネージャー](native-memory-manager.md)にさらなる進歩がもたらされ、堅牢性とパフォーマンスが向上しました：

* [カスタムメモリキーアロケータのプレビュー](#preview-of-custom-memory-allocator)
* [メインスレッドでの Objective-C または Swift オブジェクトの解放フック](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [Kotlin/Native での定数値アクセス時のオブジェクト初期化の廃止](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [iOS シミュレーターテストでのスタンドアロンモード構成機能](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native におけるライブラリのリンケージ](#library-linkage-in-kotlin-native)

### カスタムメモリキーアロケータのプレビュー

Kotlin 1.9.0 では、カスタムメモリキーアロケータのプレビューが導入されました。そのアロケーションシステムにより、[Kotlin/Native メモリマネージャー](native-memory-manager.md)のランタイムパフォーマンスが向上します。

Kotlin/Native の現在のオブジェクトアロケーションシステムは、効率的なガベージコレクションのための機能を持たない汎用アロケータを使用しています。これを補うために、ガベージコレクター（GC）がスイープ（掃除）中に反復処理できるように、アロケートされたすべてのオブジェクトのスレッドローカルな連結リストを維持し、その後単一のリストにマージします。このアプローチには、いくつかのパフォーマンス上の欠点があります：

* スイープの順序にメモリの局所性がなく、メモリへのアクセスパターンが分散しがちで、潜在的なパフォーマンスの問題につながります。
* 連結リストはオブジェクトごとに余分なメモリを必要とし、特に多くの小さなオブジェクトを扱う場合にメモリ使用量が増加します。
* アロケートされたオブジェクトのリストが単一であるため、スイープを並列化することが難しく、ミューテータスレッドが GC スレッドよりも速くオブジェクトをアロケートする場合にメモリ使用量の問題を引き起こす可能性があります。

これらの問題を解決するために、Kotlin 1.9.0 ではカスタムアロケータのプレビューが導入されました。これはシステムメモリをページに分割し、連続した順序で独立したスイープを可能にします。各アロケーションはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。さまざまなアロケーションサイズに合わせて、異なるページタイプが最適化されています。メモリブロックを連続して配置することで、アロケートされたすべてのブロックを効率的に反復処理できます。

スレッドがメモリをアロケートするとき、アロケーションサイズに基づいて適切なページを検索します。スレッドはサイズカテゴリごとにページのセットを保持します。通常、特定のサイズの現在のページでアロケーションを収容できます。収容できない場合、スレッドは共有アロケーションスペースから別のページを要求します。このページはすでに利用可能であるか、スイープが必要であるか、あるいは最初に作成される必要があります。

新しいアロケータでは、複数の独立したアロケーションスペースを同時に持つことができるため、Kotlin チームはパフォーマンスをさらに向上させるためにさまざまなページレイアウトを実験することが可能になります。

新しいアロケータの設計の詳細については、こちらの [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) を参照してください。

#### 有効にする方法

`-Xallocator=custom` コンパイラオプションを追加します：

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```
{validate="false"}

#### フィードバックをお寄せください

カスタムアロケータを改善するために、[YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) でのフィードバックをお待ちしております。

### メインスレッドでの Objective-C または Swift オブジェクトの解放フック

Kotlin 1.9.0 以降、オブジェクトがメインスレッドで Kotlin に渡された場合、Objective-C または Swift オブジェクトの解放フック（deallocation hook）がメインスレッドで呼び出されるようになりました。[Kotlin/Native メモリマネージャー](native-memory-manager.md)が以前 Objective-C オブジェクトへの参照を処理していた方法では、メモリリークが発生する可能性がありました。新しい動作により、メモリマネージャーの堅牢性が向上すると確信しています。

Kotlin コードで参照される Objective-C オブジェクトを考えてみましょう（例：引数として渡された場合、関数によって返された場合、コレクションから取得された場合など）。この場合、Kotlin は Objective-C オブジェクトへの参照を保持する独自のオブジェクトを作成します。Kotlin オブジェクトが解放されると、Kotlin/Native ランタイムは Objective-C の参照を解放する `objc_release` 関数を呼び出します。

以前、Kotlin/Native メモリマネージャーは特別な GC スレッドで `objc_release` を実行していました。それが最後のオブジェクト参照であれば、オブジェクトは解放されます。Objective-C オブジェクトが Objective-C の `dealloc` メソッドや Swift の `deinit` ブロックのようなカスタム解放フックを持っており、それらのフックが特定のスレッドで呼び出されることを期待している場合に問題が発生する可能性がありました。

メインスレッド上のオブジェクトのフックは通常そこで呼び出されることを期待しているため、Kotlin/Native ランタイムは `objc_release` もメインスレッドで呼び出すようになりました。これにより、Objective-C オブジェクトがメインスレッドで Kotlin に渡され、そこで Kotlin のピア（対になる）オブジェクトが作成された場合がカバーされるはずです。これは、通常の UI アプリケーションのようにメインのディスパッチキューが処理されている場合にのみ機能します。メインキューでない場合や、オブジェクトがメイン以外のスレッドで Kotlin に渡された場合、`objc_release` は以前と同様に特別な GC スレッドで呼び出されます。

#### オプトアウト（無効化）する方法

問題が発生した場合は、`gradle.properties` ファイルで次のオプションを使用してこの動作を無効にできます：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

このようなケースに遭遇した場合は、遠慮なく[課題トラッカー](https://kotl.in/issue)に報告してください。

### Kotlin/Native での定数値アクセス時のオブジェクト初期化の廃止

Kotlin 1.9.0 以降、Kotlin/Native バックエンドは `const val` フィールドにアクセスする際にオブジェクトを初期化しなくなりました：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 最初は初期化されない
    val x = MyObject    // ここで初期化が発生する
    println(x.y)
}
```
{validate="false"}

この動作は、Java との実装の整合性が取れており、この場合にオブジェクトが初期化されない Kotlin/JVM と統一されました。この変更により、Kotlin/Native プロジェクトにおけるパフォーマンスの向上も期待できます。

### iOS シミュレーターテストでのスタンドアロンモード構成機能

デフォルトでは、Kotlin/Native の iOS シミュレーターテストを実行する際、シミュレーターの手動起動と終了を避けるために `--standalone` フラグが使用されます。1.9.0 では、Gradle タスクの `standalone` プロパティを介して、このフラグを使用するかどうかを構成できるようになりました。デフォルトでは `--standalone` フラグが使用されるため、スタンドアロンモードは有効になっています。

`build.gradle.kts` ファイルでスタンドアロンモードを無効にする例を以下に示します：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> スタンドアロンモードを無効にした場合、シミュレーターを手動で起動する必要があります。CLI からシミュレーターを起動するには、次のコマンドを使用します：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native におけるライブラリのリンケージ

Kotlin 1.9.0 以降、Kotlin/Native コンパイラは、Kotlin ライブラリのリンケージの問題を Kotlin/JVM と同じように処理するようになりました。サードパーティの Kotlin ライブラリの作成者が、別のサードパーティ Kotlin ライブラリが消費している実験的な API に互換性のない変更を加えた場合、このような問題に直面することがあります。

現在は、サードパーティの Kotlin ライブラリ間でリンケージの問題があっても、コンパイル中にビルドが失敗することはありません。代わりに、JVM とまったく同様に、実行時にのみこれらのエラーに遭遇することになります。

Kotlin/Native コンパイラは、ライブラリのリンケージに関する問題を検出するたびに警告を報告します。このような警告はコンパイルログで確認できます（例）：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

プロジェクトでこの動作をさらに構成したり、無効にしたりすることも可能です：

* コンパイルログにこれらの警告を表示したくない場合は、`-Xpartial-linkage-loglevel=INFO` コンパイラオプションで抑制してください。
* 報告される警告の重要度を `-Xpartial-linkage-loglevel=ERROR` でコンパイルエラーに引き上げることも可能です。この場合、コンパイルは失敗し、コンパイルログにすべてのエラーが表示されます。このオプションを使用して、リンケージの問題をより詳しく調査してください。
* この機能で予期しない問題が発生した場合は、いつでも `-Xpartial-linkage=disable` コンパイラオプションでオプトアウトできます。このようなケースに遭遇した場合は、遠慮なく[課題トラッカー](https://kotl.in/issue)に報告してください。

```kotlin
// Gradle ビルドファイルを介してコンパイラオプションを渡す例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンケージの警告を抑制する場合：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // リンケージの警告をエラーに引き上げる場合：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 機能を完全に無効にする場合：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C インターオペラビリティの暗黙的な整数変換用コンパイラオプション

C インターオペラビリティにおいて暗黙的な整数変換を可能にするコンパイラオプションを導入しました。慎重に検討した結果、この機能にはまだ改善の余地があり、最高品質の API を目指しているため、意図しない使用を防ぐためにこのコンパイラオプションを導入することにしました。

このコードサンプルでは、[`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) が符号なし型 `UInt` を持ち、`0` が符号付きであるにもかかわらず、暗黙的な整数変換により `options = 0` が許可されています。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

ネイティブインターオペラビリティライブラリで暗黙的な変換を使用するには、`-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` コンパイラオプションを使用してください。

これは、Gradle の `build.gradle.kts` ファイルで構成できます：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform には、開発者体験を向上させるために設計されたいくつかの注目すべきアップデートが 1.9.0 で追加されました：

* [Android ターゲットサポートの変更](#changes-to-android-target-support)
* [新しい Android ソースセットレイアウトのデフォルト有効化](#new-android-source-set-layout-enabled-by-default)
* [マルチプラットフォームプロジェクトにおける Gradle 設定キャッシュ（configuration cache）のプレビュー](#preview-of-the-gradle-configuration-cache)

### Android ターゲットサポートの変更

私たちは、Kotlin Multiplatform を安定させるための取り組みを続けています。重要なステップは、Android ターゲットに対してファーストクラスのサポートを提供することです。将来的に、Google の Android チームが Kotlin Multiplatform で Android をサポートするための独自の Gradle プラグインを提供することを発表できることを嬉しく思います。

Google からのこの新しいソリューションへの道を開くために、1.9.0 では現在の Kotlin DSL の `android` ブロックの名前を変更しています。ビルドスクリプト内のすべての `android` ブロックを `androidTarget` に変更してください。これは、Google から提供される次期 DSL のために `android` という名前を解放するために必要な一時的な変更です。

Google のプラグインは、マルチプラットフォームプロジェクトで Android を扱うための推奨される方法になる予定です。準備が整い次第、以前と同様に短い `android` という名前を使用できるように、必要な移行手順を提供します。

### 新しい Android ソースセットレイアウトのデフォルト有効化

Kotlin 1.9.0 以降、新しい Android ソースセットレイアウトがデフォルトになります。これは、さまざまな面で混乱を招いていた以前のディレクトリ命名スキーマに代わるものです。新しいレイアウトには、多くの利点があります：

* 型セマンティクスの簡素化 – 新しい Android ソースレイアウトは、異なるタイプのソースセットを区別するのに役立つ、明確で一貫した命名規則を提供します。
* ソースディレクトリレイアウトの改善 – 新しいレイアウトにより、`SourceDirectories` の配置がより一貫したものになり、コードの整理やソースファイルの特定が容易になります。
* Gradle 構成の明確な命名スキーマ – `KotlinSourceSets` と `AndroidSourceSets` の両方で、スキーマが一貫し、予測しやすくなりました。

新しいレイアウトには Android Gradle プラグインバージョン 7.0 以降が必要で、Android Studio 2022.3 以降でサポートされています。`build.gradle(.kts)` ファイルで必要な変更を行うには、[移行ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html)を参照してください。

### Gradle 設定キャッシュのプレビュー

<p id="preview-of-gradle-configuration-cache">Kotlin 1.9.0 では、マルチプラットフォームライブラリにおける <a href="https://docs.gradle.org/current/userguide/configuration_cache.html">Gradle 設定キャッシュ（configuration cache）</a>のサポートが追加されました。ライブラリの作者であれば、改善されたビルドパフォーマンスの恩恵をすでに受けることができます。</p>

Gradle 設定キャッシュは、以降のビルドで構成フェーズ（configuration phase）の結果を再利用することで、ビルドプロセスを高速化します。この機能は Gradle 8.1 から Stable になりました。有効にするには、[Gradle ドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)の指示に従ってください。

> Kotlin Multiplatform プラグインは、Xcode 統合タスクや [Kotlin CocoaPods Gradle プラグイン](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)での Gradle 設定キャッシュをまだサポートしていません。将来の Kotlin リリースでこの機能を追加する予定です。
>
{style="note"}

## Kotlin/Wasm

Kotlin チームは、新しい Kotlin/Wasm ターゲットの実験を続けています。このリリースでは、いくつかのパフォーマンスおよび [サイズ関連の最適化](#size-related-optimizations)に加えて、[JavaScript インターオペラビリティのアップデート](#updates-in-javascript-interop)が導入されています。

### サイズ関連の最適化

Kotlin 1.9.0 では、WebAssembly (Wasm) プロジェクトのサイズが大幅に改善されました。2 つの「Hello World」プロジェクトを比較すると、Kotlin 1.9.0 の Wasm のコードフットプリントは、Kotlin 1.8.20 の 10 分の 1 以下になりました。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

これらのサイズ最適化により、Kotlin コードで Wasm プラットフォームをターゲットにする際のリソース利用がより効率的になり、パフォーマンスが向上します。

### JavaScript インターオペラビリティのアップデート

今回の Kotlin アップデートでは、Kotlin/Wasm における Kotlin と JavaScript 間の相互運用性に変更が導入されました。Kotlin/Wasm は[試験的（Experimental）](components-stability.md#stability-levels-explained)な機能であるため、その相互運用性には特定の制限が適用されます。

#### Dynamic 型の制限

バージョン 1.9.0 以降、Kotlin は Kotlin/Wasm における `Dynamic` 型の使用をサポートしなくなりました。これは、JavaScript の相互運用性を促進する新しい汎用型 `JsAny` のために非推奨となりました。

詳細は、[JavaScript との Kotlin/Wasm 相互運用性](wasm-js-interop.md)のドキュメントを参照してください。

#### 非外部（non-external）型の制限

Kotlin/Wasm は、値を JavaScript との間で受け渡しする際に、特定の Kotlin 静的型の変換をサポートしています。サポートされている型は以下の通りです：

* プリミティブ（符号付き数値、`Boolean`、`Char` など）。
* `String`。
* 関数型。

その他の型は不透明な参照（opaque references）として変換なしで渡されるため、JavaScript と Kotlin のサブタイピングの間で不整合が生じていました。

これを解決するために、Kotlin は JavaScript インターオペラビリティを、十分にサポートされている型のセットに制限します。Kotlin 1.9.0 以降、Kotlin/Wasm の JavaScript インターオペラビリティでは、外部（external）、プリミティブ、文字列、および関数型のみがサポートされます。さらに、JavaScript インターオペラビリティで使用できる Kotlin/Wasm オブジェクトへのハンドルを表すために、`JsReference` という別の明示的な型が導入されました。

詳細は、[JavaScript との Kotlin/Wasm 相互運用性](wasm-js-interop.md)のドキュメントを参照してください。

### Kotlin Playground での Kotlin/Wasm

Kotlin Playground が Kotlin/Wasm ターゲットをサポートしました。
Kotlin/Wasm をターゲットとした Kotlin コードを記述、実行、共有できます。[ぜひお試しください！](https://pl.kotl.in/HDFAvimga)

> Kotlin/Wasm を使用するには、ブラウザで試験的な機能を有効にする必要があります。
>
> [これらの機能を有効にする方法の詳細](wasm-configuration.md)。
>
{style="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

このリリースでは、古い Kotlin/JS コンパイラの削除、Kotlin/JS Gradle プラグインの非推奨化、および ES2015 の試験的サポートを含む、Kotlin/JS のアップデートが導入されています：

* [古い Kotlin/JS コンパイラの削除](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle プラグインの非推奨化](#deprecation-of-the-kotlin-js-gradle-plugin)
* [外部 enum（external enum）の非推奨化](#deprecation-of-external-enum)
* [ES2015 クラスおよびモジュールの試験的サポート](#experimental-support-for-es2015-classes-and-modules)
* [JS 本番配布（production distribution）のデフォルト出力先の変更](#changed-default-destination-of-js-production-distribution)
* [stdlib-js からの org.w3c 宣言の抽出](#extract-org-w3c-declarations-from-stdlib-js)

> バージョン 1.9.0 から、Kotlin/JS でも[部分的なライブラリリンケージ](#library-linkage-in-kotlin-native)が有効になりました。
>
{style="note"}

### 古い Kotlin/JS コンパイラの削除

Kotlin 1.8.0 で、IR ベースのバックエンドが [Stable](components-stability.md) になったことを[発表](whatsnew18.md#stable-js-ir-compiler-backend)しました。それ以来、コンパイラを指定しないことはエラーとなり、古いコンパイラを使用すると警告が表示されるようになりました。

Kotlin 1.9.0 では、古いバックエンドを使用するとエラーが発生します。IR コンパイラへの移行をお願いします。

### Kotlin/JS Gradle プラグインの非推奨化

Kotlin 1.9.0 以降、`kotlin-js` Gradle プラグインは非推奨となります。代わりに `js()` ターゲットを指定した `kotlin-multiplatform` Gradle プラグインを使用することをお勧めします。

Kotlin/JS Gradle プラグインの機能は、本質的に `kotlin-multiplatform` プラグインを複製したものであり、内部で同じ実装を共有していました。この重複は混乱を招き、Kotlin チームのメンテナンス負荷を増大させていました。

移行手順については、[Kotlin Multiplatform 互換性ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)を参照してください。ガイドに記載されていない問題が見つかった場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### 外部 enum の非推奨化

Kotlin 1.9.0 では、Kotlin 以外には存在し得ない `entries` のような静的な enum メンバーに関する問題のため、外部 enum（external enum）の使用が非推奨となります。代わりに、オブジェクトのサブクラスを持つ外部 sealed クラス（external sealed class）を使用することをお勧めします：

```kotlin
// 以前
external enum class ExternalEnum { A, B }

// 以降
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

オブジェクトのサブクラスを持つ外部 sealed クラスに切り替えることで、デフォルトメソッドに関連する問題を回避しながら、外部 enum と同様の機能を実現できます。

Kotlin 1.9.0 以降、外部 enum の使用は非推奨としてマークされます。互換性と将来のメンテナンスのために、提案された外部 sealed クラスの実装を利用するようにコードを更新することをお勧めします。

### ES2015 クラスおよびモジュールの試験的サポート

このリリースでは、ES2015 モジュールおよび ES2015 クラス生成の[試験的（Experimental）](components-stability.md#stability-levels-explained)なサポートが導入されました：
* モジュールはコードベースを簡素化し、メンテナンス性を向上させる方法を提供します。
* クラスはオブジェクト指向プログラミング (OOP) の原則を取り入れることを可能にし、よりクリーンで直感的なコードをもたらします。

これらの機能を有効にするには、`build.gradle.kts` ファイルを適宜更新してください：

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // ES2015 モジュールを有効化
        browser()
    }
}

// ES2015 クラスの生成を有効化
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[ES2015 (ECMAScript 2015, ES6) の詳細については公式ドキュメントを参照してください](https://262.ecma-international.org/6.0/)。

### JS 本番配布のデフォルト出力先の変更

Kotlin 1.9.0 より前は、配布ターゲットディレクトリは `build/distributions` でした。しかし、これは Gradle アーカイブの一般的なディレクトリです。この問題を解決するために、Kotlin 1.9.0 ではデフォルトの配布ターゲットディレクトリを `build/dist/<targetName>/<binaryName>` に変更しました。

たとえば、`productionExecutable` は `build/distributions` にありましたが、Kotlin 1.9.0 では `build/dist/js/productionExecutable` になります。

> これらのビルドの結果を使用するパイプラインがある場合は、必ずディレクトリを更新してください。
>
{style="warning"}

### stdlib-js からの org.w3c 宣言の抽出

Kotlin 1.9.0 以降、`stdlib-js` には `org.w3c` 宣言が含まれなくなりました。代わりに、これらの宣言は別の Gradle 依存関係に移動されました。Kotlin Multiplatform Gradle プラグインを `build.gradle.kts` ファイルに追加すると、標準ライブラリと同様に、これらの宣言は自動的にプロジェクトに含まれます。

手動での操作や移行の必要はありません。必要な調整は自動的に処理されます。

## Gradle

Kotlin 1.9.0 には、新しい Gradle コンパイラオプションなどが含まれています：

* [classpath プロパティの削除](#removed-classpath-property)
* [新しい Gradle コンパイラオプション](#new-compiler-options)
* [Kotlin/JVM 用のプロジェクトレベルのコンパイラオプション](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native モジュール名用のコンパイラオプション](#compiler-option-for-kotlin-native-module-name)
* [公式 Kotlin ライブラリ用の個別のコンパイラプラグイン](#separate-compiler-plugins-for-official-kotlin-libraries)
* [最小サポートバージョンの引き上げ](#incremented-minimum-supported-version)
* [kapt が Gradle でのタスクの即時作成（eager task creation）を引き起こさないように修正](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM ターゲット検証モードのプログラムによる構成](#programmatic-configuration-of-the-jvm-target-validation-mode)

### classpath プロパティの削除

Kotlin 1.7.0 で、`KotlinCompile` タスクのプロパティ `classpath` の非推奨サイクルの開始を発表しました。Kotlin 1.8.0 で非推奨レベルが `ERROR` に引き上げられました。今回のリリースで、ついに `classpath` プロパティを削除しました。すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストとして `libraries` 入力を使用する必要があります。

### 新しいコンパイラオプション

Kotlin Gradle プラグインは、オプトイン（opt-ins）とコンパイラのプログレッシブ（progressive）モードのための新しいプロパティを提供するようになりました。

* 新しい API をオプトインするには、`optIn` プロパティを使用し、`optIn.set(listOf(a, b, c))` のように文字列のリストを渡すことができるようになりました。
* プログレッシブモードを有効にするには、`progressiveMode.set(true)` を使用します。

### Kotlin/JVM 用のプロジェクトレベルのコンパイラオプション

Kotlin 1.9.0 以降、`kotlin` 構成ブロック内に新しい `compilerOptions` ブロックが利用可能になりました：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

これにより、コンパイラオプションの構成が非常に簡単になります。ただし、いくつかの重要な点に注意してください：

* この構成はプロジェクトレベルでのみ機能します。
* Android プラグインの場合、このブロックは以下と同じオブジェクトを構成します：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions` と `kotlin.compilerOptions` の構成ブロックはお互いを上書きします。ビルドファイル内の最後の（一番下の）ブロックが常に有効になります。
* `moduleName` がプロジェクトレベルで構成されている場合、コンパイラに渡される際にその値が変更される可能性があります。`main` のコンパイルではそうではありませんが、テストソースなどの他のタイプでは、Kotlin Gradle プラグインが `_test` サフィックスを追加します。
* `tasks.withType<KotlinJvmCompile>().configureEach {}` (または `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) 内の構成は、`kotlin.compilerOptions` と `android.kotlinOptions` の両方を上書きします。

### Kotlin/Native モジュール名用のコンパイラオプション

Kotlin/Native の [`module-name`](compiler-reference.md#module-name-name-native) コンパイラオプションが、Kotlin Gradle プラグインで簡単に利用できるようになりました。

このオプションは、コンパイルモジュールの名前を指定し、Objective-C にエクスポートされる宣言の名前プレフィックスを追加するためにも使用できます。

Gradle ビルドファイルの `compilerOptions` ブロックで直接モジュール名を設定できるようになりました：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>

### 公式 Kotlin ライブラリ用の個別のコンパイラプラグイン

Kotlin 1.9.0 では、公式ライブラリ用に個別のコンパイラプラグインが導入されました。以前は、コンパイラプラグインは対応する Gradle プラグインに組み込まれていました。これにより、コンパイラプラグインが Gradle ビルドの Kotlin ランタイムバージョンよりも高い Kotlin バージョンに対してコンパイルされている場合に、互換性の問題が発生する可能性がありました。

現在はコンパイラプラグインが個別の依存関係として追加されるため、古い Gradle バージョンとの互換性の問題に直面することはなくなりました。新しいアプローチのもう 1 つの大きな利点は、新しいコンパイラプラグインを [Bazel](https://bazel.build/) などの他のビルドシステムで使用できることです。

Maven Central に公開されている新しいコンパイラプラグインのリストは以下の通りです：

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

各プラグインには、埋め込み可能な `-embeddable` 版があります。たとえば、`kotlin-allopen-compiler-plugin-embeddable` は、スクリプトアーティファクトのデフォルトオプションである `kotlin-compiler-embeddable` アーティファクトと連携するように設計されています。

Gradle はこれらのプラグインをコンパイラ引数として追加します。既存のプロジェクトに変更を加える必要はありません。

### 最小サポートバージョンの引き上げ

Kotlin 1.9.0 以降、サポートされる Android Gradle プラグインの最小バージョンは 4.2.2 です。

[ドキュメントの Kotlin Gradle プラグインと利用可能な Gradle バージョンの互換性](gradle-configure-project.md#apply-the-plugin)を参照してください。

### kapt が Gradle でのタスクの即時作成（eager task creation）を引き起こさないように修正

1.9.0 より前は、[kapt コンパイラプラグイン](kapt.md)が、構成された Kotlin コンパイルタスクのインスタンスを要求することで、タスクの即時作成（eager task creation）を引き起こしていました。この動作は Kotlin 1.9.0 で修正されました。`build.gradle.kts` ファイルにデフォルトの構成を使用している場合、セットアップはこの変更の影響を受けません。

> カスタム構成を使用している場合、セットアップが悪影響を受ける可能性があります。
> たとえば、Gradle のタスク API を使用して `KotlinJvmCompile` タスクを変更した場合は、ビルドスクリプト内の `KaptGenerateStubs` タスクも同様に変更する必要があります。
>
> たとえば、スクリプトに `KotlinJvmCompile` タスクの次の構成がある場合：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // カスタム構成 }
> ```
> {validate="false"}
>
> この場合、同じ変更が `KaptGenerateStubs` タスクの一部として含まれていることを確認する必要があります：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // カスタム構成 }
>```
> {validate="false"}
> 
{style="warning"}

詳細については、[YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)を参照してください。

### JVM ターゲット検証モードのプログラムによる構成

Kotlin 1.9.0 より前は、Kotlin と Java 間の JVM ターゲットの不互換性の検出を調整する方法は 1 つだけでした。プロジェクト全体に対して `gradle.properties` で `kotlin.jvm.target.validation.mode=ERROR` を設定する必要がありました。

現在は、`build.gradle.kts` ファイルのタスクレベルでも構成できるようになりました：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準ライブラリ

Kotlin 1.9.0 では、標準ライブラリにいくつかの優れた改善が加えられました：
* [`..<` 演算子](#stable-operator-for-open-ended-ranges)と [Time API](#stable-time-api) が Stable になりました。
* [Kotlin/Native 標準ライブラリが徹底的に見直され、更新されました](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
* [`@Volatile` アノテーションがより多くのプラットフォームで使用できるようになりました](#stable-volatile-annotation)
* [名前で正規表現のキャプチャグループを取得する **共通（common）** 関数が追加されました](#new-common-function-to-get-regex-capture-group-by-name)
* [16進数のフォーマットとパースを行うための `HexFormat` クラスが導入されました](#new-hexformat-class-to-format-and-parse-hexadecimals)

### オープンエンドのレンジ用の Stable な ..< 演算子

[Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) で導入され、1.8.0 で Stable になった、オープンエンドのレンジ（open-ended ranges）用の新しい `..<` 演算子ですが、1.9.0 ではオープンエンドのレンジを扱うための標準ライブラリ API も Stable になりました。

調査によると、新しい `..<` 演算子はオープンエンドのレンジがいつ宣言されたかを理解しやすくします。[`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中置関数を使用すると、上限が含まれていると誤解しやすくなります。

`until` 関数を使用した例は以下の通りです：

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

そして、新しい `..<` 演算子を使用した例は以下の通りです：

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> IntelliJ IDEA バージョン 2023.1.1 以降、`..<` 演算子を使用できる場合にハイライトする新しいコードインスペクションが利用可能です。
>
{style="note"}

この演算子でできることの詳細については、[Kotlin 1.7.20 の新機能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)を参照してください。

### Stable な Time API

1.3.50 以降、新しい時間計測 API をプレビューしてきました。API の期間（duration）部分は 1.6.0 で Stable になりました。1.9.0 では、残りの時間計測 API も Stable になりました。

古い Time API では `measureTimeMillis` 関数と `measureNanoTime` 関数が提供されていましたが、これらは直感的に使用できませんでした。どちらも異なる単位で時間を計測することは明らかですが、`measureTimeMillis` が[ウォールクロック（壁時計時間）](https://en.wikipedia.org/wiki/Elapsed_real_time)を使用して時間を計測し、`measureNanoTime` が単調（monotonic）時間ソースを使用することは明らかではありませんでした。新しい Time API は、この問題やその他の問題を解決し、API をより使いやすくしています。

新しい Time API を使用すると、以下を簡単に行えます：
* 任意の時間単位で単調時間ソースを使用して、コードの実行にかかった時間を計測する。
* ある時点をマークする（Mark a moment in time）。
* 2 つの時点を比較し、その差を求める。
* 特定の時点からどれくらいの時間が経過したかを確認する。
* 現在の時間が特定の時点を過ぎたかどうかを確認する。

#### コードの実行時間の計測

コードブロックの実行にかかった時間を計測するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) インライン関数を使用します。

コードブロックの実行にかかった時間を計測し、**かつ**そのコードブロックの結果を返すには、[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) インライン関数を使用します。

デフォルトでは、両方の関数が単調時間ソースを使用します。ただし、経過リアルタイムソース（elapsed real-time source）を使用したい場合は、使用可能です。たとえば Android では、デフォルトの時間ソース `System.nanoTime()` はデバイスがアクティブな間のみ時間をカウントします。デバイスがディープスリープに入ると時間の追跡ができなくなります。デバイスがディープスリープ中も時間を追跡するには、代わりに [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) を使用する時間ソースを作成できます：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 時間の差のマーキングと計測

特定の時点をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) インターフェースと [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 関数を使用して [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/) を作成します。同じ時間ソースからの `TimeMarks` 間の差を計測するには、減算演算子 (`-`) を使用します：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 0.5秒スリープ
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // タイムマークを互いに比較することも可能です。
    println(mark2 > mark1) // mark2 は mark1 より後にキャプチャされたため、true です。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

期限が過ぎたか、タイムアウトに達したかを確認するには、[`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) および [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 拡張関数を使用します：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // まだ5秒経っていない
    println(mark2.hasPassedNow())
    // false

    // 6秒待つ
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 標準ライブラリの安定化への歩み

Kotlin/Native 用の標準ライブラリが成長し続ける中、高い基準を満たしていることを確認するために完全なレビューを行う時期が来たと判断しました。その一環として、既存の**すべての**公開シグネチャ（public signature）を注意深く見直しました。それぞれのシグネチャについて、以下の点を確認しました：

* 独自の目的があるか。
* 他の Kotlin API と一貫性があるか。
* JVM 用の対応するものと同様の動作をするか。
* 将来性があるか。

これらの考慮事項に基づき、以下のいずれかの決定を下しました：
* Stable にした。
* 試験的（Experimental）にした。
* `private` としてマークした。
* 動作を変更した。
* 別の場所に移動した。
* 非推奨（Deprecated）にした。
* 旧式（Obsolete）としてマークした。

> 既存のシグネチャが以下のように変更された場合：
> * 別のパッケージに移動された場合、シグネチャは元のパッケージにまだ存在しますが、非推奨レベル `WARNING` で非推奨となっています。IntelliJ IDEA は、コードインスペクション時に自動的に代替案を提案します。
> * 非推奨になった場合、非推奨レベル `WARNING` で非推奨となっています。
> * 旧式（Obsolete）としてマークされた場合、引き続き使用できますが、将来的に置き換えられる予定です。
>
{style="note"}

ここですべての結果を列挙することはしませんが、いくつかのハイライトを紹介します：
* Atomics API を安定化させました。
* [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) を試験的（Experimental）にし、パッケージを使用するために異なるオプトインを要求するようにしました。詳細については、[明示的な C インターオペラビリティの安定性保証](#explicit-c-interoperability-stability-guarantees)を参照してください。
* [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) クラスとそれに関連する API を旧式（Obsolete）としてマークしました。
* [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) クラスを旧式（Obsolete）としてマークしました。
* `kotlin.native.internal` パッケージ内のすべての `public` API を `private` としてマークするか、他のパッケージに移動しました。

#### 明示的な C インターオペラビリティの安定性保証

API の高い品質を維持するために、[`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) を試験的（Experimental）にすることにしました。`kotlinx.cinterop` は徹底的に試され、テストされてきましたが、Stable にするのに十分満足できるまでには、まだ改善の余地があります。インターオペラビリティのためにこの API を使用することをお勧めしますが、プロジェクト内の特定の領域に使用を限定するようにしてください。これにより、この API を Stable にするために進化させ始めた際の移行が容易になります。

ポインタなどの C ライクな外部 API を使用したい場合は、`@OptIn(ExperimentalForeignApi)` でオプトインする必要があります。そうしないとコードがコンパイルされません。

Objective-C/Swift インターオペラビリティをカバーする `kotlinx.cinterop` の残りの部分を使用するには、`@OptIn(BetaInteropApi)` でオプトインする必要があります。オプトインなしでこの API を使用しようとすると、コードはコンパイルされますが、コンパイラはどのような動作が期待できるかを明確に説明する警告を発します。

これらのアノテーションの詳細については、[`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) のソースコードを参照してください。

このレビューの一環としての**すべての**変更に関する詳細については、[YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-55765)を参照してください。

皆様からのフィードバックをお待ちしております。フィードバックは、[チケット](https://youtrack.jetbrains.com/issue/KT-57728)に直接コメントすることで提供できます。

### Stable な @Volatile アノテーション

`var` プロパティを `@Volatile` でアノテートすると、そのバッキングフィールドがマークされ、このフィールドへの読み取りまたは書き込みがアトミック（原子的一体）になり、書き込みは常に他のスレッドから見えるようになります。

1.8.20 より前は、共通の標準ライブラリで [`kotlin.jvm.Volatile` アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が利用可能でした。しかし、このアノテーションは JVM 上でしか効果がありませんでした。他のプラットフォームで使用しても無視されるため、エラーの原因となっていました。

1.8.20 では、JVM と Kotlin/Native の両方でプレビューできる、試験的な共通アノテーション `kotlin.concurrent.Volatile` を導入しました。

1.9.0 では、`kotlin.concurrent.Volatile` が Stable になりました。マルチプラットフォームプロジェクトで `kotlin.jvm.Volatile` を使用している場合は、`kotlin.concurrent.Volatile` への移行をお勧めします。

### 名前で正規表現のキャプチャグループを取得する新しい共通関数

1.9.0 より前は、正規表現のマッチからその名前で正規表現のキャプチャグループを取得するための、プラットフォームごとの独自の拡張機能がありました。しかし、共通の関数はありませんでした。Kotlin 1.8.0 より前は、標準ライブラリが依然として JVM ターゲット 1.6 および 1.7 をサポートしていたため、共通の関数を持つことは不可能でした。

Kotlin 1.8.0 以降、標準ライブラリは JVM ターゲット 1.8 でコンパイルされています。そのため 1.9.0 では、正規表現のマッチに対してその名前でグループの内容を取得するために使用できる、**共通（common）** の [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 関数が追加されました。これは、特定のキャプチャグループに属する正規表現マッチの結果にアクセスしたい場合に便利です。

以下は、`city`、`state`、`areaCode` の 3 つのキャプチャグループを含む正規表現の例です。これらのグループ名を使用して、マッチした値にアクセスできます：

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

### 親ディレクトリを作成する新しいパスユーティリティ

1.9.0 では、必要なすべての親ディレクトリと一緒に新しいファイルを作成するために使用できる、新しい `createParentDirectories()` 拡張関数が導入されました。`createParentDirectories()` にファイルパスを渡すと、親ディレクトリがすでに存在するかどうかを確認します。存在する場合は何もしません。存在しない場合は、作成してくれます。

`createParentDirectories()` は、ファイルをコピーする際に特に便利です。たとえば、`copyToRecursively()` 関数と組み合わせて使用できます：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 16進数のフォーマットとパースを行うための新しい HexFormat クラス

> 新しい `HexFormat` クラスとそれに関連する拡張関数は[試験的（Experimental）](components-stability.md#stability-levels-explained)であり、それらを使用するには、`@OptIn(ExperimentalStdlibApi::class)` でオプトインするか、コンパイラ引数 `-opt-in=kotlin.ExperimentalStdlibApi` を使用してください。
>
{style="warning"}

1.9.0 では、数値と16進文字列の間で変換を行うための試験的な機能として、[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) クラスとそれに関連する拡張関数が提供されています。具体的には、拡張関数を使用して、16進文字列と `ByteArrays`、または他の数値型 (`Int`, `Short`, `Long`) の間で変換できます。

例：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` クラスには、`HexFormat{}` ビルダーで構成できるフォーマットオプションが含まれています。

`ByteArrays` を扱う場合、プロパティで構成可能な以下のオプションがあります：

| オプション | 説明 |
|--|--|
| `upperCase` | 16進数の桁を大文字にするか小文字にするか。デフォルトでは小文字と見なされます。`upperCase = false`。 |
| `bytes.bytesPerLine` | 1行あたりの最大バイト数。 |
| `bytes.bytesPerGroup` | 1グループあたりの最大バイト数。 |
| `bytes.bytesSeparator` | バイト間のセパレータ（区切り文字）。デフォルトでは何もありません。 |
| `bytes.bytesPrefix` | 各バイトの2桁の16進表現の直前に置く文字列。デフォルトでは何もありません。 |
| `bytes.bytesSuffix` | 各バイトの2桁の16進表現の直後に置く文字列。デフォルトでは何もありません。 |

例：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// HexFormat{} ビルダーを使用して、16進文字列をコロンで区切る
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// HexFormat{} ビルダーを使用して：
// * 16進文字列を大文字にする
// * バイトをペアでグループ化する
// * ピリオドで区切る
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

数値型を扱う場合、プロパティで構成可能な以下のオプションがあります：

| オプション | 説明 |
|--|--|
| `number.prefix` | 16進文字列のプレフィックス。デフォルトでは何もありません。 |
| `number.suffix` | 16進文字列のサフィックス。デフォルトでは何もありません。 |
| `number.removeLeadingZeros` | 16進文字列の先行ゼロ（leading zeros）を削除するかどうか。デフォルトでは、先行ゼロは削除されません。`number.removeLeadingZeros = false` |

例：

```kotlin
// HexFormat{} ビルダーを使用して、プレフィックス "0x" を持つ16進数をパースする。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## ドキュメントのアップデート

Kotlin ドキュメントには、いくつかの注目すべき変更が加えられました：
* [tour of Kotlin（Kotlin へのツアー）](kotlin-tour-welcome.md) – 理論と実践の両方を含む章で、Kotlin プログラミング言語の基礎を学びます。
* [Android ソースセットレイアウト](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html) – 新しい Android ソースセットレイアウトについて学びます。
* [Kotlin Multiplatform 互換性ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html) – Kotlin Multiplatform でプロジェクトを開発する際に遭遇する可能性のある互換性のない変更について学びます。
* [Kotlin Wasm](wasm-overview.md) – Kotlin/Wasm について、および Kotlin Multiplatform プロジェクトでの使用方法について学びます。

## Kotlin 1.9.0 のインストール

### IDE バージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 および 2023.1.1 は、Kotlin プラグインをバージョン 1.9.0 に更新することを自動的に提案します。IntelliJ IDEA 2023.2 には Kotlin 1.9.0 プラグインが含まれます。

Android Studio Giraffe (223) および Hedgehog (231) は、今後のリリースで Kotlin 1.9.0 をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHub リリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)からダウンロード可能です。

### Gradle 設定の構成

Kotlin のアーティファクトと依存関係をダウンロードするには、`settings.gradle(.kts)` ファイルを更新して Maven Central リポジトリを使用するようにしてください：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradle は廃止予定の JCenter リポジトリを使用し、Kotlin アーティファクトに関する問題が発生する可能性があります。

## Kotlin 1.9.0 互換性ガイド

Kotlin 1.9.0 は[機能リリース（feature release）](kotlin-evolution-principles.md#language-and-tooling-releases)であり、以前のバージョンの言語で書かれたコードと互換性のない変更が導入される可能性があります。これらの変更の詳細なリストについては、[Kotlin 1.9.0 互換性ガイド](compatibility-guide-19.md)を参照してください。