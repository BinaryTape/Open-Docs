[//]: # (title: Kotlin 2.2.x 互換性ガイド)

_[「言語をモダンに保つ」](kotlin-evolution-principles.md)_ および _[「快適なアップデート」](kotlin-evolution-principles.md)_ は、Kotlin 言語設計における基本的な原則です。前者は言語の進化を妨げる構文を削除すべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、その削除を事前に十分に周知すべきであることを示しています。

ほとんどの言語の変更は、アップデートの変更ログやコンパイラの警告などの他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらをすべてまとめ、Kotlin 2.1 から Kotlin 2.2 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、数種類の互換性について紹介します。

- _ソース_: ソース互換性のない（source-incompatible）変更は、以前は問題なく（エラーや警告なしで）コンパイルできていたコードをコンパイルできなくします。
- _バイナリ_: 2 つのバイナリアーティファクトを入れ替えても、ロードエラーやリンクエラーが発生しない場合、それらはバイナリ互換（binary-compatible）であると言います。
- _振る舞い_: 変更の適用前後で同じプログラムが異なる動作を示す場合、その変更は振る舞いの互換性がない（behavioral-incompatible）と言います。

これらの定義は、純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語

### `-language-version` における 1.6 および 1.7 のサポート廃止

> **課題**: [KT-71793](https://youtrack.jetbrains.com/issue/KT-71793)
>
> **コンポーネント**: コンパイラ
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin 2.2 以降、コンパイラは [`-language-version=1.6`](compiler-reference.md#language-version-version) または `-language-version=1.7` をサポートしなくなります。
> これは、1.8 より古い言語機能セットがサポートされなくなることを意味します。ただし、言語自体は Kotlin 1.0 との完全な後方互換性を維持しています。
>
> **非推奨化サイクル**:
>
> - 2.1.0: `-language-version` で 1.6 および 1.7 を使用したときに警告を報告
> - 2.2.0: `-language-version` で 1.8 および 1.9 を使用したときに警告を報告。1.6 および 1.7 については警告をエラーに引き上げ

### アノテーション付きラムダでの invokedynamic をデフォルトで有効化

> **課題**: [KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
>
> **短い概要**: アノテーション付きのラムダは、デフォルトで `LambdaMetafactory` を介して `invokedynamic` を使用するようになり、Java のラムダの動作と一致するようになります。
> これは、生成されたラムダクラスからアノテーションを取得することに依存していたリフレクションベースのコードに影響します。
> 以前の動作に戻すには、`-Xindy-allow-annotated-lambdas=false` コンパイラオプションを使用してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: アノテーション付きラムダでの `invokedynamic` をデフォルトで有効化

### K2 において、展開後の型にバリアンスを持つ型エイリアスでのコンストラクタ呼び出しと継承を禁止

> **課題**: [KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `out` などのバリアンス（variance）修飾子を使用する型に展開される型エイリアス（type aliases）を使用したコンストラクタ呼び出しおよび継承は、K2 コンパイラでサポートされなくなりました。
> これにより、元の型を使用することは許可されないのに、型エイリアスを介した同じ使用法が許可されていた不整合が解消されます。
> 移行するには、必要に応じて元の型を明示的に使用してください。
>
> **非推奨化サイクル**:
>
> - 2.0.0: バリアンス修飾子を持つ型に展開される型エイリアスでのコンストラクタ呼び出しまたはスーパータイプとしての使用に対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### Kotlin のゲッターからの合成プロパティを禁止

> **課題**: [KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin で定義されたゲッターに対する合成プロパティ（synthetic properties）は許可されなくなりました。
> これは、Java クラスが Kotlin クラスを継承している場合や、`java.util.LinkedHashSet` のようなマップされた型を扱う場合に影響します。
> 移行するには、プロパティアクセスを対応するゲッター関数の直接呼び出しに置き換えてください。
>
> **非推奨化サイクル**:
>
> - 2.0.0: Kotlin のゲッターから作成された合成プロパティへのアクセスに対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### JVM におけるインターフェース関数のデフォルトメソッド生成の変更

> **課題**: [KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: バイナリ
>
> **短い概要**: インターフェースで宣言された関数は、特に設定されていない限り、JVM デフォルトメソッドとしてコンパイルされるようになりました。
> これにより、関連のないスーパータイプが競合する実装を定義している場合に、Java コードでコンパイルエラーが発生する可能性があります。
> この動作は、現在非推奨となっている `-Xjvm-default` オプションに代わる、安定した `-jvm-default` コンパイラオプションによって制御されます。
> デフォルトの実装が `DefaultImpls` クラスとサブクラスにのみ生成される以前の動作に戻すには、`-jvm-default=disable` を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: `-jvm-default` コンパイラオプションのデフォルト値が `enable` に設定

### アノテーションプロパティにおけるフィールドターゲットのアノテーションを禁止

> **課題**: [KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: アノテーションプロパティにおけるフィールドターゲット（field-targeted）のアノテーションは許可されなくなりました。
> これらのアノテーションに観測可能な効果はありませんでしたが、この変更はそれらに依存していたカスタム IR プラグインに影響を与える可能性があります。
> 移行するには、プロパティからフィールドターゲットのアノテーションを削除してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: アノテーションプロパティにおける `@JvmField` アノテーションが警告付きで非推奨
> - 2.1.20: アノテーションプロパティにおけるすべてのフィールドターゲットのアノテーションに対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### 型エイリアスにおける reified 型パラメータを禁止

> **課題**: [KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 型エイリアス（type aliases）の型パラメータにおける `reified` 修飾子は許可されなくなりました。
> reified 型パラメータはインライン関数内でのみ有効であるため、型エイリアスで使用しても効果はありませんでした。
> 移行するには、`typealias` 宣言から `reified` 修飾子を削除してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: 型エイリアスにおける reified 型パラメータに対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### Number および Comparable に対するインライン値クラスの型チェックを修正

> **課題**: [KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 振る舞い
>
> **短い概要**: インライン値クラス（inline value classes）は、`is` および `as` チェックにおいて `java.lang.Number` または `java.lang.Comparable` の実装として扱われなくなりました。
> これらのチェックは、以前はボックス化されたインラインクラスに適用された際に誤った結果を返していました。
> この最適化は現在、プリミティブ型とそのラッパーにのみ適用されます。
>
> **非推奨化サイクル**:
>
> - 2.2.0: 新しい動作を有効化

### 間接的な依存関係からのアクセス不能なジェネリック型を禁止

> **課題**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: K2 コンパイラは、コンパイラから見えない間接的な依存関係からの型を使用している場合にエラーを報告するようになりました。
> これは、依存関係が不足しているために参照されている型が利用できない場合の、ラムダパラメータやジェネリック型引数などのケースに影響します。
>
> **非推奨化サイクル**:
>
> - 2.0.0: ラムダ内のアクセス不能なジェネリック型、およびアクセス不能なジェネリック型引数の一部での使用に対してエラーを報告。ラムダ内のアクセス不能な非ジェネリック型、および式やスーパータイプ内のアクセス不能な型引数に対して警告を報告
> - 2.1.0: ラムダ内のアクセス不能な非ジェネリック型に対する警告をエラーに引き上げ
> - 2.2.0: 式内の型引数におけるアクセス不能な型引数に対する警告をエラーに引き上げ

### 型パラメータの境界に対する可視性チェックを強制

> **課題**: [KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 関数やプロパティは、宣言自体よりも制限の厳しい可視性（visibility）を持つ型パラメータ境界を使用できなくなりました。
> これにより、以前はエラーなしでコンパイルされていても、実行時の失敗や一部のケースで IR 検証エラーにつながっていた、アクセス不能な型の間接的な露出を防ぐことができます。
>
> **非推奨化サイクル**:
>
> - 2.1.0: 型パラメータに、宣言の可視性スコープから見えない境界がある場合に警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### 非 private なインライン関数で private な型を公開している場合にエラーを報告

> **課題**: [KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 非 private なインライン関数から private な型、関数、またはプロパティにアクセスすることは許可されなくなりました。
> 移行するには、private なエンティティの参照を避けるか、関数を private にするか、`inline` 修飾子を削除してください。
> `inline` を削除するとバイナリ互換性が失われることに注意してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: 非 private なインライン関数から private な型またはメンバーにアクセスしている場合にエラーを報告

### パラメータのデフォルト値として使用されるラムダ内での非ローカルリターンを禁止

> **課題**: [KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: パラメータのデフォルト値として使用されるラムダ内での非ローカルリターン（non-local return）ステートメントは許可されなくなりました。
> このパターンは以前はコンパイルされていましたが、実行時のクラッシュを引き起こしていました。移行するには、非ローカルリターンを避けるようにラムダを書き直すか、ロジックをデフォルト値の外に移動してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: パラメータのデフォルト値として使用されるラムダ内の非ローカルリターンに対してエラーを報告

## 標準ライブラリ

### kotlin.native.Throws の非推奨化

> **課題**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **コンポーネント**: Kotlin/Native
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `kotlin.native.Throws` は非推奨になりました。代わりに共通（common）の [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) アノテーションを使用してください。
>
> **非推奨化サイクル**:
>
> - 1.9.0: `kotlin.native.Throws` を使用したときに警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### AbstractDoubleTimeSource の非推奨化

> **課題**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `AbstractDoubleTimeSource` は非推奨になりました。代わりに [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/) を使用してください。
>
> **非推奨化サイクル**:
>
> - 1.8.20: `AbstractDoubleTimeSource` を使用したときに警告を報告
> - 2.2.0: 警告をエラーに引き上げ

## ツール

### ソースを置換するように KotlinCompileTool の setSource() 関数を修正

> **課題**: [KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: 振る舞い
>
> **短い概要**: [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) インターフェースの [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 関数は、設定されたソースに追加するのではなく、置換するようになりました。
> 既存のソースを置換せずにソースを追加したい場合は、[`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 関数を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: 新しい動作を有効化

### KotlinCompilationOutput#resourcesDirProvider プロパティの非推奨化

> **課題**: [KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `KotlinCompilationOutput#resourcesDirProvider` プロパティは非推奨になりました。
> 追加のリソースディレクトリを追加するには、Gradle ビルドスクリプトで代わりに [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` が警告付きで非推奨
> - 2.2.0: 警告をエラーに引き上げ

### BaseKapt.annotationProcessorOptionProviders プロパティの非推奨化

> **課題**: [KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: [`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) プロパティは、`MutableList<Any>` の代わりに `ListProperty<CommandLineArgumentProvider>` を受け取る `BaseKapt.annotationProcessorOptionsProviders` に代わって非推奨になりました。
> これにより、期待される要素型が明確に定義され、ネストされたリストなどの誤った要素の追加による実行時の失敗を防ぐことができます。
> 現在のコードでリストを単一の要素として追加している場合は、`add()` 関数を `addAll()` 関数に置き換えてください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: API で新しい型を強制

### kotlin-android-extensions プラグインの非推奨化

> **課題**: [KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `kotlin-android-extensions` プラグインは非推奨になりました。`Parcelable` 実装ジェネレータには別のプラグイン [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) を、合成ビュー（synthetic views）には Android Jetpack の [ビューバインディング](https://developer.android.com/topic/libraries/view-binding) をそれぞれ代わりに使用してください。
>
> **非推奨化サイクル**:
>
> - 1.4.20: プラグインが非推奨に
> - 2.1.20: 設定エラーが導入され、プラグインのコードは実行されなくなりました
> - 2.2.0: プラグインのコードが削除されました

### kotlinOptions DSL の非推奨化

> **課題**: [KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `kotlinOptions` DSL および関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介してコンパイラオプションを設定する機能は、新しい `compilerOptions` DSL に代わって非推奨になりました。
> この非推奨化の一環として、`kotlinOptions` インターフェース内のすべてのプロパティも個別に非推奨としてマークされました。
> 移行するには、`compilerOptions` DSL を使用してコンパイラオプションを設定してください。移行の詳細については、[Migrate from `kotlinOptions {}` to `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions) を参照してください。
>
> **非推奨化サイクル**:
>
> - 2.0.0: `kotlinOptions` DSL に対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ、`kotlinOptions` 内のすべてのプロパティを非推奨化

### kotlin.incremental.useClasspathSnapshot プロパティの削除

> **課題**: [KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `kotlin.incremental.useClasspathSnapshot` Gradle プロパティが削除されました。
> このプロパティは、Kotlin 1.8.20 以降でデフォルトで有効になっているクラスパスベースのアプローチに置き換えられた、非推奨の JVM 履歴ベースのインクリメンタルコンパイルモードを制御していました。
>
> **非推奨化サイクル**:
>
> - 2.0.20: `kotlin.incremental.useClasspathSnapshot` プロパティを警告付きで非推奨化
> - 2.2.0: プロパティを削除

### Kotlin スクリプトに関する非推奨化

> **課題**: [KT-71685](https://youtrack.jetbrains.com/issue/KT-71685), [KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/), [KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/).
>
> **コンポーネント**: スクリプティング
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin 2.2.0 では以下のサポートが非推奨になります：
>   * REPL: `kotlinc` を介して REPL を引き続き使用するには、`-Xrepl` コンパイラオプションでオプトインしてください。
>   * JSR-223: [JSR](https://jcp.org/en/jsr/detail?id=223) が **Withdrawn（撤回）** 状態であるためです。JSR-223 実装は言語バージョン 1.9 では引き続き動作しますが、将来的に K2 コンパイラへ移行する計画はありません。
>   * `KotlinScriptMojo` Maven プラグイン。引き続き使用すると、コンパイラの警告が表示されます。
>
> 詳細については、[ブログポスト](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)を参照してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: `kotlinc` での REPL の使用を警告付きで非推奨化
> - 2.2.0: `kotlinc` を介して REPL を使用するには、`-Xrepl` コンパイラオプションでオプトインが必要。JSR-223 を非推奨化（言語バージョン 1.9 に切り替えることでサポートを復元可能）。`KotlinScriptMojo` Maven プラグインを非推奨化

### 曖昧さ回避分類器プロパティの非推奨化

> **課題**: [KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin Gradle プラグインがソースセット名と IDE インポートの曖昧さを解消する方法を制御するために使用されていたオプションは、不要になりました。そのため、`KotlinTarget` インターフェースの以下のプロパティは現在非推奨です：
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **非推奨化サイクル**:
>
> - 2.0.0: これらの Gradle プロパティが使用されたときに警告を報告
> - 2.1.0: 警告をエラーに引き上げ
> - 2.2.0: Gradle プロパティを削除

### コモナイゼーションパラメータの非推奨化

> **課題**: [KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 実験的なコモナイゼーション（commonization）モードのパラメータは、Kotlin Gradle プラグインで非推奨になりました。
> これらのパラメータは、無効なコンパイルアーティファクトを生成し、それがキャッシュされる可能性があります。影響を受けるアーティファクトを削除するには：
>
> 1. `gradle.properties` ファイルから以下のオプションを削除します：
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2. `~/.konan/*/klib/commonized` ディレクトリ内のコモナイゼーションキャッシュをクリアするか、以下のコマンドを実行します：
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **非推奨化サイクル**:
>
> - 2.2.0: コモナイゼーションパラメータをエラー付きで非推奨化
> - 2.2.20: コモナイゼーションパラメータを削除

### レガシーなメタデータコンパイルのサポートを非推奨化

> **課題**: [KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 階層構造をセットアップし、共通ソースセットと中間ソースセットの間に中間ソースセットを作成するために使用されていたオプションは、不要になりました。
> 以下のコンパイラオプションが削除されます：
> 
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **非推奨化サイクル**:
>
> - 2.2.0: Kotlin Gradle プラグインからコンパイラオプションを削除

### KotlinCompilation.source API の非推奨化

> **課題**: [KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin ソースセットを Kotlin コンパイルに直接追加できる `KotlinCompilation.source` API へのアクセスが非推奨になりました。
>
> **非推奨化サイクル**:
>
> - 1.9.0: `KotlinCompilation.source` が使用されたときに警告を報告
> - 1.9.20: 警告をエラーに引き上げ
> - 2.2.0: Kotlin Gradle プラグインから `KotlinCompilation.source` を削除。これを使用しようとすると、ビルドスクリプトのコンパイル中に "unresolved reference" エラーが発生します。

### ターゲットプリセット API の非推奨化

> **課題**: [KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: Kotlin Multiplatform ターゲットのターゲットプリセット（target presets）は不要になりました。`jvm()` や `iosSimulatorArm64()` などのターゲット DSL 関数が同じユースケースをカバーするようになったためです。プリセット関連のすべての API は非推奨です：
> 
> * `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` の `presets` プロパティ
> * `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` インターフェースとそのすべての継承クラス
> * `fromPreset` オーバーロード
>
> **非推奨化サイクル**:
>
> - 1.9.20: プリセット関連 API のあらゆる使用に対して警告を報告
> - 2.0.0: 警告をエラーに引き上げ
> - 2.2.0: Kotlin Gradle プラグインの公開 API からプリセット関連 API を削除。これらを使用しているソースは "unresolved reference" エラーで失敗し、バイナリ（例：Gradle プラグイン）は、最新バージョンの Kotlin Gradle プラグインに対して再コンパイルされない限り、リンクエラーで失敗する可能性があります。

### Apple ターゲットのショートカットを非推奨化

> **課題**: [KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `ios()`、`watchos()`、および `tvos()` ターゲットショートカットは、Kotlin Multiplatform DSL で非推奨になりました。
> これらのショートカットは、Apple ターゲットのソースセット階層を部分的に作成するために設計されました。現在、Kotlin Multiplatform Gradle プラグインは、組み込みの階層テンプレートを提供しています。ショートカットの代わりにターゲットのリストを指定すると、プラグインがそれらの中間ソースセットを自動的にセットアップします。
>
> **非推奨化サイクル**:
>
> - 1.9.20: ターゲットショートカットが使用されたときに警告を報告。代わりにデフォルトの階層テンプレートがデフォルトで有効になります
> - 2.1.0: ターゲットショートカットが使用されたときにエラーを報告
> - 2.2.0: Kotlin Multiplatform Gradle プラグインからターゲットショートカット DSL を削除

### publishAllLibraryVariants() 関数の非推奨化

> **課題**: [KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `publishAllLibraryVariants()` 関数は非推奨になりました。これは Android ターゲットのすべてのビルドバリアントを公開するために設計されました。このアプローチは、特に複数のフレーバーやビルドタイプが使用されている場合に、バリアント解決の問題を引き起こす可能性があるため、現在は推奨されません。代わりに、ビルドバリアントを指定する `publishLibraryVariants()` 関数を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: `publishAllLibraryVariants()` を非推奨化

### android ターゲットの非推奨化

> **課題**: [KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 現在の Kotlin DSL において、`android` ターゲット名は非推奨になりました。代わりに `androidTarget` を使用してください。
>
> **非推奨化サイクル**:
>
> - 1.9.0: Kotlin Multiplatform プロジェクトで `android` 名が使用された場合に非推奨警告を導入
> - 2.1.0: 警告をエラーに引き上げ
> - 2.2.0: Kotlin Multiplatform Gradle プラグインから `android` ターゲット DSL を削除

### CInteropProcess における konanVersion の非推奨化

> **課題**: [KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `CInteropProcess` タスクの `konanVersion` プロパティは非推奨になりました。
> 代わりに `CInteropProcess.kotlinNativeVersion` を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: `konanVersion` プロパティが使用されたときに警告を報告
> - 2.2.0: 警告をエラーに引き上げ
> - 2.3.0: Kotlin Gradle プラグインから `konanVersion` プロパティを削除

### CInteropProcess における destinationDir の非推奨化

> **課題**: [KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: `CInteropProcess` タスクの `destinationDir` プロパティは非推奨になりました。
> 代わりに `CInteropProcess.destinationDirectory.set()` 関数を使用してください。
>
> **非推奨化サイクル**:
>
> - 2.1.0: `destinationDir` プロパティが使用されたときに警告を報告
> - 2.2.0: 警告をエラーに引き上げ
> - 2.3.0: Kotlin Gradle プラグインから `destinationDir` プロパティを削除

### kotlinArtifacts API の非推奨化

> **課題**: [KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **短い概要**: 実験的な `kotlinArtifacts` API は非推奨になりました。[最終的なネイティブバイナリを構築](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)するには、Kotlin Gradle プラグインで利用可能な現在の DSL を使用してください。
> 移行に不十分な場合は、[この YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-74953)にコメントを残してください。
>
> **非推奨化サイクル**:
>
> - 2.2.0: `kotlinArtifacts` API が使用されたときに警告を報告
> - 2.3.0: 警告をエラーに引き上げ