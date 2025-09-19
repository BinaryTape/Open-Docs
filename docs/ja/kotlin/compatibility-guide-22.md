[//]: # (title: Kotlin 2.2 互換性ガイド)

_[言語の現代性を保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本原則です。前者は、言語の進化を妨げる構成要素を削除すべきであると述べ、後者は、コードの移行を可能な限り円滑にするため、この削除が事前に十分に伝達されるべきであると述べています。

言語の変更点のほとんどは、更新の変更履歴やコンパイラの警告など、他のチャネルを通じて既に発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 2.1 から Kotlin 2.2 への移行のための完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース互換性_: ソース非互換の変更は、以前は（エラーや警告なしで）問題なくコンパイルされていたコードが、それ以降コンパイルできなくなる変更です。
- _バイナリ互換性_: 2つのバイナリアーティファクトは、それらを交換してもロードエラーやリンクエラーが発生しない場合に、バイナリ互換性があると言われます。
- _動作互換性_: 変更が適用される前と後で、同じプログラムが異なる動作を示す場合、その変更は動作非互換であると言われます。

これらの定義は純粋な Kotlin についてのみ適用されることに注意してください。他の言語の観点（例えば Java から見た場合）での Kotlin コードの互換性については、このドキュメントの範囲外です。

## 言語

### アノテーション付きラムダに対する invokedynamic のデフォルト有効化

> **イシュー**: [KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: 動作
>
> **概要**: アノテーション付きラムダは、`LambdaMetafactory` を介してデフォルトで `invokedynamic` を使用するようになり、その動作が Java のラムダと整合するようになりました。これは、生成されたラムダクラスからアノテーションを取得することに依存していたリフレクションベースのコードに影響します。以前の動作に戻すには、`-Xindy-allow-annotated-lambdas=false` コンパイラオプションを使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: アノテーション付きラムダに対して `invokedynamic` をデフォルトで有効化

### K2における、展開型で分散を持つ型エイリアスでのコンストラクタ呼び出しと継承の禁止

> **イシュー**: [KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: `out` などの分散修飾子を使用する型に展開される型エイリアスを使用したコンストラクタ呼び出しおよび継承は、K2コンパイラではサポートされなくなりました。これにより、元の型の使用は許可されていないが、型エイリアスを介した同じ使用は許可されていた矛盾が解消されます。移行するには、必要に応じて元の型を明示的に使用してください。
>
> **非推奨サイクル**:
>
> - 2.0.0: 分散修飾子を持つ型に展開される型エイリアスでのコンストラクタ呼び出しまたはスーパークラス使用に対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### Kotlinゲッターからの合成プロパティの禁止

> **イシュー**: [KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: Kotlinで定義されたゲッターに対して合成プロパティは許可されなくなりました。これは、JavaクラスがKotlinクラスを継承する場合や、`java.util.LinkedHashSet`のようなマップされた型を扱う場合に影響します。移行するには、プロパティアクセスを対応するゲッター関数への直接呼び出しに置き換えてください。
>
> **非推奨サイクル**:
>
> - 2.0.0: Kotlinゲッターから作成された合成プロパティへのアクセスに対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### JVM上のインターフェース関数に対するデフォルトメソッド生成の変更

> **イシュー**: [KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: バイナリ
>
> **概要**: インターフェースで宣言された関数は、別途設定しない限り、JVMのデフォルトメソッドにコンパイルされるようになりました。これにより、関連しないスーパークラスが競合する実装を定義する場合、Javaコードでコンパイルエラーを引き起こす可能性があります。この動作は、現在非推奨の `-Xjvm-default` オプションを置き換える安定版の `-jvm-default` コンパイラオプションによって制御されます。デフォルト実装が `DefaultImpls` クラスとサブクラスでのみ生成される以前の動作を復元するには、`-jvm-default=disable` を使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: `-jvm-default` コンパイラオプションがデフォルトで `enable` に設定される

### アノテーションプロパティに対するフィールドターゲットアノテーションの禁止

> **イシュー**: [KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: フィールドをターゲットとするアノテーションは、アノテーションプロパティでは許可されなくなりました。これらのアノテーションは目に見える効果はありませんでしたが、この変更はそれらに依存していたカスタムIRプラグインに影響を与える可能性があります。移行するには、プロパティからフィールドをターゲットとするアノテーションを削除してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `@JvmField` アノテーションがアノテーションプロパティで警告付きで非推奨となる
> - 2.1.20: アノテーションプロパティ上のすべてのフィールドをターゲットとするアノテーションに対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### 型エイリアスにおける具象化型パラメータの禁止

> **イシュー**: [KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: 型エイリアス内の型パラメータに `reified` 修飾子を使用することは許可されなくなりました。具象化型パラメータはインライン関数でのみ有効であるため、型エイリアスで使用しても効果がありませんでした。移行するには、`typealias` 宣言から `reified` 修飾子を削除してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: 型エイリアス内の具象化型パラメータに対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### `Number` と `Comparable` のインライン値クラスに対する型チェックの修正

> **イシュー**: [KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換変更の種類**: 動作
>
> **概要**: インライン値クラスは、`is` および `as` チェックにおいて、`java.lang.Number` または `java.lang.Comparable` の実装者として扱われなくなりました。これらのチェックは以前は、ボックス化されたインラインクラスに適用すると誤った結果を返していました。最適化はプリミティブ型とそのラッパーにのみ適用されるようになりました。
>
> **非推奨サイクル**:
>
> - 2.2.0: 新しい動作を有効化

### 間接的な依存関係からのアクセス不能なジェネリック型の禁止

> **イシュー**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: K2コンパイラは、コンパイラから見えない間接的な依存関係からの型を使用する際にエラーを報告するようになりました。これは、ラムダパラメータやジェネリック型引数のように、参照されている型が依存関係の欠如により利用できない場合に影響します。
>
> **非推奨サイクル**:
>
> - 2.0.0: ラムダ内のアクセス不能なジェネリック型およびアクセス不能なジェネリック型引数の選択された使用に対してエラーを報告。ラムダ内のアクセス不能な非ジェネリック型および式とスーパークラスの型におけるアクセス不能な型引数に対して警告を報告
> - 2.1.0: ラムダ内のアクセス不能な非ジェネリック型に対する警告をエラーに昇格
> - 2.2.0: 式の型におけるアクセス不能な型引数に対する警告をエラーに昇格

### 型パラメータ境界に対する可視性チェックの強制

> **イシュー**: [KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: 関数とプロパティは、宣言自体よりも制限的な可視性を持つ型パラメータ境界を使用できなくなりました。これにより、アクセス不能な型を間接的に公開することを防ぎます。これは以前はエラーなしでコンパイルされましたが、場合によっては実行時エラーやIR検証エラーにつながっていました。
>
> **非推奨サイクル**:
>
> - 2.1.0: 型パラメータが宣言の可視性スコープから見えない境界を持っている場合に警告を報告
> - 2.2.0: 警告をエラーに昇格

### 非プライベートインライン関数でプライベート型を公開する際のエラー報告

> **イシュー**: [KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: 非プライベートインライン関数からプライベート型、関数、またはプロパティにアクセスすることは許可されなくなりました。移行するには、プライベートなエンティティを参照しないか、関数をプライベートにするか、`inline` 修飾子を削除してください。`inline` を削除するとバイナリ互換性が損なわれることに注意してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: 非プライベートインライン関数からプライベート型またはメンバーにアクセスする際にエラーを報告

### パラメータのデフォルト値として使用されるラムダにおける非ローカルリターンの禁止

> **イシュー**: [KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **コンポーネント**: コア言語
>
> **非互換変更の種類**: ソース
>
> **概要**: パラメータのデフォルト値として使用されるラムダ内で、非ローカルのreturn文は許可されなくなりました。このパターンは以前はコンパイルできましたが、実行時クラッシュを引き起こしました。移行するには、ラムダを書き換えて非ローカルリターンを避けるか、ロジックをデフォルト値の外に移動してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: パラメータのデフォルト値として使用されるラムダにおける非ローカルリターンに対してエラーを報告

## 標準ライブラリ

### `kotlin.native.Throws` の非推奨化

> **イシュー**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **コンポーネント**: Kotlin/Native
>
> **非互換変更の種類**: ソース
>
> **概要**: `kotlin.native.Throws` は非推奨になりました。代わりに共通の [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) アノテーションを使用してください。
>
> **非推奨サイクル**:
>
> - 1.9.0: `kotlin.native.Throws` を使用する際に警告を報告
> - 2.2.0: 警告をエラーに昇格

### `AbstractDoubleTimeSource` の非推奨化

> **イシュー**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更の種類**: ソース
>
> **概要**: `AbstractDoubleTimeSource` は非推奨になりました。代わりに [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/) を使用してください。
>
> **非推奨サイクル**:
>
> - 1.8.20: `AbstractDoubleTimeSource` を使用する際に警告を報告
> - 2.2.0: 警告をエラーに昇格

## ツール

### `KotlinCompileTool` の `setSource()` 関数がソースを置き換えるように修正

> **イシュー**: [KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: 動作
>
> **概要**: [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) インターフェースの [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 関数は、設定されたソースに追加するのではなく、置き換えるようになりました。既存のソースを置き換えずにソースを追加したい場合は、[`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: 新しい動作を有効化

### `KotlinCompilationOutput#resourcesDirProvider` プロパティの非推奨化

> **イシュー**: [KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `KotlinCompilationOutput#resourcesDirProvider` プロパティは非推奨になりました。追加のリソースディレクトリを追加するには、Gradleビルドスクリプトで代わりに [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` は警告付きで非推奨
> - 2.2.0: 警告をエラーに昇格

### `BaseKapt.annotationProcessorOptionProviders` プロパティの非推奨化

> **イシュー**: [KT-58009](https://youtrack.com/issue/KT-58009)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: [`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) プロパティは非推奨になりました。`MutableList<Any>` の代わりに `ListProperty<CommandLineArgumentProvider>` を受け入れる `BaseKapt.annotationProcessorOptionsProviders` が推奨されます。これにより、期待される要素タイプが明確に定義され、誤った要素（ネストされたリストなど）の追加による実行時エラーを防ぎます。現在のコードがリストを単一の要素として追加している場合、`add()` 関数を `addAll()` 関数に置き換えてください。
>
> **非推奨サイクル**:
>
> - 2.2.0: APIで新しい型を強制

### `kotlin-android-extensions` プラグインの非推奨化

> **イシュー**: [KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `kotlin-android-extensions` プラグインは非推奨になりました。`Parcelable` 実装ジェネレーターには別のプラグイン [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) を、合成ビューには Android Jetpack の [ビューバインディング](https://developer.android.com/topic/libraries/view-binding) を代わりに使用してください。
>
> **非推奨サイクル**:
>
> - 1.4.20: プラグインが非推奨となる
> - 2.1.20: 設定エラーが導入され、プラグインコードは実行されない
> - 2.2.0: プラグインコードが削除される

### `kotlinOptions` DSLの非推奨化

> **イシュー**: [KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `kotlinOptions` DSLと関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介してコンパイラオプションを設定する機能は、新しい `compilerOptions` DSLを優先して非推奨になりました。この非推奨化の一環として、`kotlinOptions` インターフェースのすべてのプロパティも個別に非推奨としてマークされています。移行するには、`compilerOptions` DSLを使用してコンパイラオプションを設定してください。移行に関するガイダンスについては、「[`kotlinOptions {}` から `compilerOptions {}` への移行](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)」を参照してください。
>
> **非推奨サイクル**:
>
> - 2.0.0: `kotlinOptions` DSLに対して警告を報告
> - 2.2.0: 警告をエラーに昇格し、`kotlinOptions` のすべてのプロパティを非推奨化

### `kotlin.incremental.useClasspathSnapshot` プロパティの削除

> **イシュー**: [KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `kotlin.incremental.useClasspathSnapshot` Gradleプロパティは削除されました。このプロパティは、非推奨のJVM履歴ベースのインクリメンタルコンパイルモードを制御していました。このモードは、Kotlin 1.8.20以降デフォルトで有効になっているクラスパスベースのアプローチに置き換えられました。
>
> **非推奨サイクル**:
>
> - 2.0.20: `kotlin.incremental.useClasspathSnapshot` プロパティを警告付きで非推奨とする
> - 2.2.0: プロパティを削除

### Kotlinスクリプト機能の非推奨化

> **イシュー**: [KT-71685](https://youtrack.jetbrains.com/issue/KT-71685)、[KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/)、[KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/)。
>
> **コンポーネント**: スクリプト
>
> **非互換変更の種類**: ソース
>
> **概要**: Kotlin 2.2.0 では、以下のサポートが非推奨になります。
> * REPL: `kotlinc` を介してREPLを継続して使用するには、`-Xrepl` コンパイラオプションでオプトインしてください。
> * JSR-223: [JSR](https://jcp.org/en/jsr/detail?id=223) が **Withdrawn (撤回済み)** の状態にあるためです。JSR-223の実装は言語バージョン1.9では引き続き動作しますが、将来的にK2コンパイラへの移行計画はありません。
> * `KotlinScriptMojo` Mavenプラグイン。引き続き使用するとコンパイラ警告が表示されます。
>
> 詳細については、当社の[ブログ記事](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)を参照してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlinc` におけるREPLの使用を警告付きで非推奨とする
> - 2.2.0: `kotlinc` を介してREPLを使用するには、`-Xrepl` コンパイラオプションでオプトインする。JSR-223を非推奨とする（言語バージョン1.9に切り替えることでサポートを復元可能）。`KotlinScriptMojo` Mavenプラグインを非推奨とする。

### 曖昧さ解消分類子プロパティの非推奨化

> **イシュー**: [KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: Kotlin Gradleプラグインがソースセット名とIDEインポートの曖昧さを解消する方法を制御するために使用されていたオプションは、廃止されました。したがって、`KotlinTarget` インターフェースの以下のプロパティは非推奨になりました。
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **非推奨サイクル**:
>
> - 2.0.0: Gradleプロパティが使用された場合に警告を報告
> - 2.1.0: この警告をエラーに昇格
> - 2.2.0: Gradleプロパティを削除

### 共通化パラメータの非推奨化

> **イシュー**: [KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: 実験的な共通化モードのパラメータは、Kotlin Gradleプラグインで非推奨になりました。これらのパラメータは、無効なコンパイルアーティファクトを生成し、それがキャッシュされる可能性があります。影響を受けるアーティファクトを削除するには：
>
> 1.  `gradle.properties` ファイルから以下のオプションを削除します。
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2.  `~/.konan/*/klib/commonized` ディレクトリ内の共通化キャッシュをクリアするか、次のコマンドを実行します。
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **非推奨サイクル**:
>
> - 2.2.0: 共通化パラメータをエラー付きで非推奨とする
> - 2.2.20: 共通化パラメータを削除

### レガシーメタデータコンパイルのサポートの非推奨化

> **イシュー**: [KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: 共通ソースセットと中間ソースセットの間に階層構造を設定し、中間ソースセットを作成するために使用されていたオプションは廃止されました。以下のコンパイラオプションは削除されます。
>
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **非推奨サイクル**:
>
> - 2.2.0: Kotlin Gradleプラグインからコンパイラオプションを削除

### `KotlinCompilation.source` APIの非推奨化

> **イシュー**: [KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: KotlinソースセットをKotlinコンパイルに直接追加することを許可していた `KotlinCompilation.source` APIへのアクセスは非推奨になりました。
>
> **非推奨サイクル**:
>
> - 1.9.0: `KotlinCompilation.source` が使用された場合に警告を報告
> - 1.9.20: この警告をエラーに昇格
> - 2.2.0: Kotlin Gradleプラグインから `KotlinCompilation.source` を削除。それを使用しようとすると、ビルドスクリプトのコンパイル中に「unresolved reference」エラーが発生する

### ターゲットプリセットAPIの非推奨化

> **イシュー**: [KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: Kotlin Multiplatformターゲットのターゲットプリセットは廃止されました。`jvm()` や `iosSimulatorArm64()` のようなターゲットDSL関数が同じユースケースをカバーするようになりました。プリセット関連のAPIはすべて非推奨になりました。
>
> * `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` の `presets` プロパティ
> * `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` インターフェースとそのすべての継承者
> * `fromPreset` のオーバーロード
>
> **非推奨サイクル**:
>
> - 1.9.20: プリセット関連APIのすべての使用に対して警告を報告
> - 2.0.0: この警告をエラーに昇格
> - 2.2.0: Kotlin Gradleプラグインの公開APIからプリセット関連APIを削除。引き続きそれを使用するソースは「unresolved reference」エラーで失敗し、バイナリ（例えばGradleプラグイン）は、Kotlin Gradleプラグインの最新バージョンに対して再コンパイルされない限り、リンクエラーで失敗する可能性があります

### Appleターゲットショートカットの非推奨化

> **イシュー**: [KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `ios()`、`watchos()`、`tvos()` のターゲットショートカットは、Kotlin Multiplatform DSLで非推奨になりました。ショートカットは、Appleターゲットのソースセット階層を部分的に作成するために設計されました。Kotlin Multiplatform Gradleプラグインは、組み込みの階層テンプレートを提供するようになりました。ショートカットの代わりに、ターゲットのリストを指定すると、プラグインがそれらの中間ソースセットを自動的に設定します。
>
> **非推奨サイクル**:
>
> - 1.9.20: ターゲットショートカットが使用された場合に警告を報告。代わりにデフォルトでデフォルトの階層テンプレートが有効になる
> - 2.1.0: ターゲットショートカットが使用された場合にエラーを報告
> - 2.2.0: Kotlin Multiplatform GradleプラグインからターゲットショートカットDSLを削除

### `publishAllLibraryVariants()` 関数の非推奨化

> **イシュー**: [KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `publishAllLibraryVariants()` 関数は非推奨になりました。これはAndroidターゲットのすべてのビルドバリアントを公開するように設計されていました。特に複数のフレーバーとビルドタイプが使用されている場合、バリアント解決に問題を引き起こす可能性があるため、現在は推奨されません。代わりにビルドバリアントを指定する `publishLibraryVariants()` 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: `publishAllLibraryVariants()` は非推奨となる

### `android` ターゲットの非推奨化

> **イシュー**: [KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: 現在のKotlin DSLでは `android` ターゲット名が非推奨になりました。代わりに `androidTarget` を使用してください。
>
> **非推奨サイクル**:
>
> - 1.9.0: Kotlin Multiplatformプロジェクトで `android` 名が使用された場合に非推奨警告を導入
> - 2.1.0: この警告をエラーに昇格
> - 2.2.0: Kotlin Multiplatform Gradleプラグインから `android` ターゲットDSLを削除

### `CInteropProcess` の `konanVersion` の非推奨化

> **イシュー**: [KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `CInteropProcess` タスクの `konanVersion` プロパティは非推奨になりました。代わりに `CInteropProcess.kotlinNativeVersion` を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `konanVersion` プロパティが使用された場合に警告を報告
> - 2.2.0: この警告をエラーに昇格
> - 2.3.0: Kotlin Gradleプラグインから `konanVersion` プロパティを削除

### `destinationDir` の `CInteropProcess` 非推奨化

> **イシュー**: [KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: `CInteropProcess` タスクの `destinationDir` プロパティは非推奨になりました。代わりに `CInteropProcess.destinationDirectory.set()` 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `destinationDir` プロパティが使用された場合に警告を報告
> - 2.2.0: この警告をエラーに昇格
> - 2.3.0: Kotlin Gradleプラグインから `destinationDir` プロパティを削除

### `kotlinArtifacts` APIの非推奨化

> **イシュー**: [KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: ソース
>
> **概要**: 実験的な `kotlinArtifacts` APIは非推奨になりました。最終的なネイティブバイナリをビルドするには、Kotlin Gradleプラグインで利用可能な現在のDSLを[使用してください](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。移行に十分でない場合は、[こちらのYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-74953)にコメントを残してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: `kotlinArtifacts` APIが使用された場合に警告を報告
> - 2.3.0: この警告をエラーに昇格