[//]: # (title: Kotlin %kotlinEapVersion% の新機能)

<primary-label ref="eap"/>

<web-summary>Kotlin Early Access Preview（EAP）のリリースノートを確認し、正式リリース前の最新の実験的機能を試してみましょう。</web-summary>

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは Early Access Preview (EAP) リリースのすべての機能を網羅しているわけではありませんが、主要な改善点について詳しく説明します。
>
> 変更点の完全なリストについては、[GitHub の変更履歴](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！この EAP リリースの主な内容は以下の通りです。

* **Kotlin コンパイラプラグイン**: [Lombok が Alpha に昇格](#lombok-is-now-alpha)、[`kotlin.plugin.jpa` プラグインにおける JPA サポートの向上](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Kotlin/Native**: [C および Objective-C ライブラリ用の新しい相互運用モード](#kotlin-native-new-interoperability-mode-for-c-or-objective-c-libraries)
* **Gradle**: [Gradle 9.3.0 との互換性](#compatibility-with-gradle-9-3-0)、[Kotlin/JVM コンパイルでデフォルトで BTA を使用](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**: [Kotlin プロジェクト向けのセットアップの簡素化](#maven-simplified-setup-for-kotlin-projects)
* **標準ライブラリ**: [Map.Entry の不変コピーを作成するための新しい API](#standard-library-new-api-for-creating-immutable-copies-of-map-entry)

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

%kotlinEapVersion% をサポートする Kotlin プラグインは、IntelliJ IDEA および Android Studio の最新バージョンに同梱されています。
IDE で Kotlin プラグインを更新する必要はありません。
ビルドスクリプト内の [Kotlin バージョンを %kotlinEapVersion% に変更](configure-build-for-eap.md)するだけで利用できます。

詳細は [新しいリリースへのアップデート](releases.md#update-to-a-new-kotlin-version) を参照してください。

## Kotlin コンパイラプラグイン

Kotlin %kotlinEapVersion% では、Lombok および `kotlin.plugin.jpa` コンパイラプラグインに重要なアップデートが行われました。

### Lombok が Alpha になりました
<primary-label ref="alpha"/>

Kotlin 1.5.20 では、Kotlin と Java のコードが混在するモジュールで [Java の Lombok 宣言](https://projectlombok.org/)を生成および使用できるようにする、実験的な [Lombok コンパイラプラグイン](lombok.md)が導入されました。

%kotlinEapVersion% では、Lombok コンパイラプラグインが [Alpha](components-stability.md#stability-levels-explained) に昇格しました。これは、この機能を製品レベルに引き上げる計画があることを意味しますが、現在も開発中であることを示しています。

### `kotlin.plugin.jpa` プラグインにおける JPA サポートの向上

`kotlin.plugin.jpa` プラグインは、既存の [`no-arg`](no-arg-plugin.md) サポートに加えて、新しく追加された組み込みの JPA プリセットを使用して [`all-open`](all-open-plugin.md) コンパイラプラグインを自動的に適用するようになりました。

以前は、`kotlin("plugin.jpa")` を使用すると JPA プリセットを使用した `no-arg` プラグインのみが有効になっていました。そのため、JPA エンティティを扱う際には、JPA エンティティクラスを `open` にするために、`all-open` プラグインを明示的に適用して設定する必要がありました。

Kotlin %kotlinEapVersion% 以降では：

* `all-open` コンパイラプラグインが JPA プリセットを提供します。
* Gradle の `org.jetbrains.kotlin.plugin.jpa` プラグインは、JPA プリセットを有効にした状態で `org.jetbrains.kotlin.plugin.all-open` プラグインを自動的に適用します。
* [Maven の JPA セットアップ](no-arg-plugin.md#jpa-support)では、デフォルトで JPA プリセットを使用した `all-open` が有効になります。
* Maven 依存関係の `org.jetbrains.kotlin:kotlin-maven-noarg` に `org.jetbrains.kotlin:kotlin-maven-allopen` が暗黙的に含まれるようになったため、`<plugin><dependencies>` ブロックに明示的に追加する必要がなくなりました。

その結果、以下の注釈が付いた JPA エンティティは、追加の設定なしで自動的に `open` として扱われ、引数なしのコンストラクタが生成されます。

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

この変更により、ビルド構成が簡素化され、JPA フレームワークで Kotlin を使用する際の初期状態での使い勝手が向上します。

## Kotlin/Native: C および Objective-C ライブラリ用の新しい相互運用モード
<primary-label ref="experimental-opt-in"/>

Kotlin Multiplatform ライブラリまたはアプリケーションで C または Objective-C ライブラリを使用している場合は、新しい相互運用（interoperability）モードをテストし、結果を共有してください。

一般的に、Kotlin/Native では C および Objective-C ライブラリを Kotlin にインポートできます。しかし、Kotlin Multiplatform ライブラリの場合、この機能は現在、古いコンパイラバージョンとの KMP 互換性の問題による[影響を受けています](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)。

つまり、ある Kotlin バージョンでコンパイルされた Kotlin Multiplatform ライブラリを公開すると、C または Objective-C ライブラリをインポートしていることが原因で、それより前の Kotlin バージョンのプロジェクトでその Kotlin ライブラリを使用できなくなる可能性があります。

この問題やその他の課題に対処するため、Kotlin チームは内部で使用されている相互運用メカニズムを刷新してきました。Kotlin 2.3.20-Beta1 以降、コンパイラオプションを通じてこの新しいモードを試すことができます。

#### 試用方法

1. Gradle ビルドファイルに `cinterops {}` ブロックまたは `pod()` 依存関係があるか確認してください。これらがある場合、プロジェクトは C または Objective-C ライブラリを使用しています。
2. プロジェクトで `2.3.20-Beta1` 以降のバージョンを使用していることを確認してください。
3. 同じビルドファイルで、cinterop ツールの呼び出しに `-Xccall-mode` コンパイラオプションを追加します。

    ```kotlin
    kotlin {
        targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
            compilations.configureEach {
                cinterops.configureEach {
                    extraOpts += listOf("-Xccall-mode", "direct")
                }
            }
        }
    }
    ```

4. 通常通り、ユニットテストやアプリの実行などを行ってプロジェクトをビルドおよびテストします。

    `--continue` オプションを使用すると、失敗が発生しても Gradle がタスクの実行を継続できるため、一度に多くの問題を見つけるのに役立ちます。

> 新しい相互運用モードはまだ [実験的（Experimental）](components-stability.md#stability-levels-explained) な段階であるため、このモードでコンパイルされたライブラリをまだ公開**しないでください**。
>
{style="warning"}

#### 結果の報告

新しい相互運用モードは、ほとんどの場合、そのまま置き換え可能なもの（drop-in replacement）となる予定です。
最終的にはデフォルトで有効にすることを計画しています。しかし、それを実現するためには、できるだけ確実に動作することを確認し、幅広いプロジェクトでテストする必要があります。その理由は以下の通りです。

* 一部の C および Objective-C 宣言は、新しいモードではまだサポートされていません（主に互換性の問題と衝突するため）。これによる実環境への影響をより正確に把握し、今後のステップの優先順位を決定したいと考えています。
* バグや考慮漏れがある可能性があります。多数の機能が相互に作用する言語のテストは困難であり、独自の機能セットを持つ言語間の相互作用をテストすることはさらに困難です。

実世界のプロジェクトを調査し、困難なケースを特定するためにご協力ください。
問題が発生したかどうかにかかわらず、結果を [この YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-83218) のコメントで共有してください。

## Gradle

Kotlin %kotlinEapVersion% は Gradle の新しいバージョンと互換性があり、Kotlin Gradle プラグインにおける Kotlin/JVM コンパイルに変更が含まれています。

### Gradle 9.3.0 との互換性

Kotlin %kotlinEapVersion% は Gradle 7.6.3 から 9.3.0 と完全に互換性があります。最新の Gradle リリースまでのバージョンも使用できますが、その場合は非推奨（deprecation）の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

### Kotlin/JVM コンパイルでデフォルトで Build tools API を使用
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% では、Kotlin Gradle プラグインにおける Kotlin/JVM コンパイルで [Build tools API](build-tools-api.md) (BTA) がデフォルトで使用されます。内部コンパイル インフラストラクチャにおけるこの変更により、Kotlin コンパイラのビルドツール サポートをより迅速に開発できるようになります。

問題に気付いた場合は、[イシュートラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration) でフィードバックを共有してください。

## Maven: Kotlin プロジェクト向けのセットアップの簡素化

Kotlin %kotlinEapVersion% では、Maven プロジェクトでの Kotlin のセットアップがより簡単になります。Kotlin がソースルートと Kotlin 標準ライブラリの自動構成をサポートするようになりました。

新しい構成により、Maven ビルドシステムで新しい Kotlin プロジェクトを作成したり、既存の Java Maven プロジェクトに Kotlin を導入したりする際に、POM ビルドファイルで手動でソースルートを作成したり、`kotlin-stdlib` の依存関係を追加したりする必要がなくなります。

### 有効化の方法

`pom.xml` ファイルで、Kotlin Maven プラグインの `<build><plugins>` セクションに `<extensions>true</extensions>` を追加します。

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinEapVersion%</version>
             <extensions>true</extensions> <!-- この拡張を追加 -->
         </plugin>
    </plugins>
</build>
```

この新しい拡張により、以下が自動的に行われます：

* 既存の Kotlin または Java のソースルートを変更することなく、`src/main/kotlin` および `src/test/kotlin` ディレクトリを作成します。
* `kotlin-stdlib` の依存関係がまだ定義されていない場合、これを追加します。

Kotlin 標準ライブラリの自動追加を無効にすることもできます。その場合は、`<properties>` セクションに以下を追加してください：

```xml
<project>
    <properties>
        <!-- プロパティを介してスマートデフォルトを無効化 -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

Kotlin プロジェクトにおける Maven 構成の詳細については、[Maven プロジェクトの構成](maven-configure-project.md)を参照してください。

## 標準ライブラリ: Map.Entry の不変コピーを作成するための新しい API
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% では、[`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/) の不変コピーを作成するための `Map.Entry.copy()` 拡張関数が導入されました。
この関数を使用すると、マップを変更した後に、あらかじめコピーしておいた [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) から取得したエントリを再利用できます。

`Map.Entry.copy()` は [実験的（Experimental）](components-stability.md#stability-levels-explained) です。オプトインするには、`@OptIn(ExperimentalStdlibApi::class)` 注釈を使用するか、コンパイラオプション `-opt-in=kotlin.ExperimentalStdlibApi` を使用してください。

以下は、`Map.Entry.copy()` を使用して可変マップからエントリを削除する例です：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // map = {1=1, 3=3}
}