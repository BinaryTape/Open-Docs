[//]: # (title: Kotlin 2.1 互換性ガイド)

[言語をモダンに保つ](kotlin-evolution-principles.md) および [快適なアップデート](kotlin-evolution-principles.md) は、Kotlin 言語設計における基本的な原則の一部です。前者は、言語の進化を妨げる構成要素は削除されるべきであると述べ、後者は、コードの移行を可能な限りスムーズにするために、この削除が事前に十分に伝えられるべきであると述べています。

ほとんどの言語変更は、更新の変更履歴やコンパイラ警告など、他のチャネルですでに発表されていますが、このドキュメントはそれらすべてをまとめ、Kotlin 2.0 から Kotlin 2.1 への移行に関する完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース_: ソース互換性のない変更は、以前は問題なく (エラーや警告なしに) コンパイルされていたコードが、もはやコンパイルできなくなる変更です。
- _バイナリ_: 2つのバイナリ成果物がバイナリ互換性があるとは、それらを入れ替えてもロードエラーやリンケージエラーが発生しない場合を指します。
- _動作_: 変更が動作互換性がないとは、同じプログラムが変更適用前後で異なる動作を示す場合を指します。

これらの定義は、純粋な Kotlin にのみ適用されることを忘れないでください。Kotlin コードの他の言語からの互換性 (例えば、Java からの互換性) は、このドキュメントの範囲外です。

## 言語

### 言語バージョン 1.4 および 1.5 の削除

> **Issue**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: Kotlin 2.1 では言語バージョン 2.1 が導入され、言語バージョン 1.4 および 1.5 のサポートが削除されます。言語バージョン 1.6 および 1.7 は非推奨になります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 言語バージョン 1.4 に対して警告を報告
> - 1.9.0: 言語バージョン 1.5 に対して警告を報告
> - 2.1.0: 言語バージョン 1.6 および 1.7 に対して警告を報告。言語バージョン 1.4 および 1.5 に対しては警告をエラーに昇格。

### Kotlin/Native での `typeOf()` 関数動作の変更

> **Issue**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: Kotlin/Native での `typeOf()` 関数の動作が Kotlin/JVM と整合され、プラットフォーム間での一貫性が確保されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Native での `typeOf()` 関数の動作を整合

### 型パラメータの境界を介した型の公開を禁止

> **Issue**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: 可視性の低い型を型パラメータの境界を介して公開することが禁止されました。これにより、型の可視性ルールの不整合が解決されます。この変更により、型パラメータの境界がクラスと同じ可視性ルールに従うようになり、JVM での IR 検証エラーなどの問題を防止します。
>
> **非推奨サイクル**:
>
> - 2.1.0: 可視性の低い型パラメータの境界を介した型公開に対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### 同じ名前の抽象 `var` プロパティと `val` プロパティの継承を禁止

> **Issue**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: クラスがインターフェースから抽象 `var` プロパティを、そしてスーパークラスから同じ名前の `val` プロパティを継承する場合、コンパイルエラーが発生するようになりました。これにより、そのようなケースでセッターが不足していることによって引き起こされる実行時クラッシュが解決されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: クラスがインターフェースから抽象 `var` プロパティを、そしてスーパークラスから同じ名前の `val` プロパティを継承する場合に警告を報告 (またはプログレッシブモードではエラー)
> - 2.2.0: 警告をエラーに昇格

### 初期化されていない enum エントリへのアクセス時にエラーを報告

> **Issue**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: コンパイラは、enum クラスまたはエントリの初期化中に、初期化されていない enum エントリにアクセスされた場合にエラーを報告するようになりました。これにより、メンバープロパティの初期化ルールとの動作が整合され、実行時例外を防止し、一貫したロジックが確保されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 初期化されていない enum エントリへのアクセス時にエラーを報告

### K2 スマートキャスト伝播の変更

> **Issue**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: K2 コンパイラは、`val x = y` のような型推論された変数に対する型情報の双方向伝播を導入することで、スマートキャスト伝播の動作を変更します。`val x: T = y` のように明示的に型付けされた変数は、型情報を伝播しなくなり、宣言された型への厳密な準拠を保証します。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### Java サブクラスにおけるメンバー拡張プロパティのオーバーライド処理の修正

> **Issue**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: Java サブクラスによってオーバーライドされたメンバー拡張プロパティのゲッターは、サブクラスのスコープ内で非表示になるようになりました。これにより、通常の Kotlin プロパティとの動作が整合されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### protected `val` をオーバーライドする `var` プロパティのゲッターとセッターの可視性整合の修正

> **Issue**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: binary
>
> **概要**: `protected val` プロパティをオーバーライドする `var` プロパティのゲッターとセッターの可視性が一貫するようになり、両方がオーバーライドされた `val` プロパティの可視性を継承します。
>
> **非推奨サイクル**:
>
> - 2.1.0: K2 でゲッターとセッターの両方に一貫した可視性を強制。K1 は影響なし。

### JSpecify nullability の不一致診断の重大度をエラーに引き上げ

> **Issue**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: `org.jspecify.annotations` (例: `@NonNull`, `@Nullable`, `@NullMarked`) からの nullability の不一致が、警告ではなくエラーとして扱われるようになり、Java 相互運用性に対するより厳密な型安全が強制されます。これらの診断の重大度を調整するには、`-Xnullability-annotations` コンパイラオプションを使用します。
>
> **非推奨サイクル**:
>
> - 1.6.0: 潜在的な nullability の不一致に対して警告を報告
> - 1.8.20: 警告を特定の JSpecify アノテーション (`@Nullable`, `@NullnessUnspecified`, `@NullMarked`、および `org.jspecify.nullness` のレガシーアノテーション (JSpecify 0.2 以前)) に拡大
> - 2.0.0: `@NonNull` アノテーションのサポートを追加
> - 2.1.0: JSpecify アノテーションのデフォルトモードを `strict` に変更し、警告をエラーに変換。デフォルトの動作を上書きするには、`-Xnullability-annotations=@org.jspecify.annotations:warning` または `-Xnullability-annotations=@org.jspecify.annotations:ignore` を使用。

### 曖昧なケースでのオーバーロード解決において、`invoke` 呼び出しよりも拡張関数を優先するように変更

> **Issue**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: オーバーロード解決は、曖昧なケースにおいて `invoke` 呼び出しよりも拡張関数を優先するよう、一貫した動作になりました。これにより、ローカル関数とプロパティの解決ロジックにおける不整合が解決されます。この変更は再コンパイル後にのみ適用され、事前にコンパイルされたバイナリには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: 一致するシグネチャを持つ拡張関数に対して、オーバーロード解決が `invoke` 呼び出しよりも拡張関数を優先するように変更。この変更は再コンパイル後にのみ適用され、事前にコンパイルされたバイナリには影響しません。

### JDK 関数インターフェースの SAM コンストラクタにおけるラムダからの Nullable 値の返却を禁止

> **Issue**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: JDK 関数インターフェースの SAM コンストラクタにおけるラムダからの nullable 値の返却は、指定された型引数が non-nullable の場合、コンパイルエラーを引き起こすようになりました。これにより、nullability の不一致が実行時例外を引き起こす可能性のある問題が解決され、より厳密な型安全が確保されます。
>
> **非推奨サイクル**:
>
> - 2.0.0: JDK 関数インターフェースの SAM コンストラクタにおける nullable な戻り値に対して非推奨警告を報告
> - 2.1.0: 新しい動作をデフォルトで有効化

### Kotlin/Native における private メンバーと public メンバーの競合処理の修正

> **Issue**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: Kotlin/Native では、private メンバーがスーパークラスの public メンバーをオーバーライドしたり、それらと競合したりすることはなくなり、Kotlin/JVM との動作が整合されます。これにより、オーバーライド解決の不整合が解決され、個別コンパイルによって引き起こされる予期せぬ動作が排除されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Native の private 関数とプロパティは、スーパークラスの public メンバーをオーバーライドしたり影響を与えたりすることはなくなり、JVM の動作と整合されます。

### public インライン関数における private 演算子関数へのアクセスを禁止

> **Issue**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: `getValue()`, `setValue()`, `provideDelegate()`, `hasNext()`, `next()` のような private 演算子関数は、public インライン関数からアクセスできなくなりました。
>
> **非推奨サイクル**:
>
> - 2.0.0: public インライン関数における private 演算子関数へのアクセスに対して非推奨警告を報告
> - 2.1.0: 警告をエラーに昇格

### `@UnsafeVariance` アノテーションが付与された不変パラメータへの無効な引数渡しの禁止

> **Issue**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: コンパイラは、型チェック時に `@UnsafeVariance` アノテーションを無視するようになり、不変型パラメータに対するより厳密な型安全が強制されます。これにより、予期される型チェックをバイパスするために `@UnsafeVariance` に依存する無効な呼び出しが防止されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### 警告レベルの Java 型の、エラーレベルの Nullable 引数に対する nullability エラーを報告

> **Issue**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: コンパイラは、警告レベルの nullable 型がより厳密なエラーレベルの nullability を持つ型引数を含む Java メソッドにおいて、nullability の不一致を検出するようになりました。これにより、以前は無視されていた型引数のエラーが正しく報告されるようになります。
>
> **非推奨サイクル**:
>
> - 2.0.0: より厳密な型引数を持つ Java メソッドにおける nullability の不一致に対して非推奨警告を報告
> - 2.1.0: 警告をエラーに昇格

### アクセスできない型の暗黙的な使用を報告

> **Issue**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **コンポーネント**: Core language
>
> **互換性のない変更タイプ**: source
>
> **概要**: コンパイラは、関数リテラルおよび型引数におけるアクセスできない型の使用を報告するようになり、不完全な型情報によって引き起こされるコンパイルおよび実行時の失敗を防止します。
>
> **非推奨サイクル**:
>
> - 2.0.0: アクセスできない非ジェネリック型のパラメータまたはレシーバーを持つ関数リテラル、およびアクセスできない型引数を持つ型に対して警告を報告。アクセスできないジェネリック型のパラメータまたはレシーバーを持つ関数リテラル、および特定のシナリオでアクセスできないジェネリック型引数を持つ型に対してエラーを報告。
> - 2.1.0: アクセスできない非ジェネリック型のパラメータおよびレシーバーを持つ関数リテラルに対して警告をエラーに昇格
> - 2.2.0: アクセスできない型引数を持つ型に対して警告をエラーに昇格

## 標準ライブラリ

### `Char` および `String` のロケール依存大文字/小文字変換関数の非推奨化

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: source
>
> **概要**: 他の Kotlin 標準ライブラリ API と同様に、`Char` および `String` のロケール依存大文字/小文字変換関数 (例: `Char.toUpperCase()` や `String.toLowerCase()`) は非推奨になりました。これらを `String.lowercase()` のようなロケール非依存の代替関数に置き換えるか、`String.lowercase(Locale.getDefault())` のようにロケール依存の動作のために明示的にロケールを指定してください。
>
> Kotlin 2.1.0 で非推奨になった Kotlin 標準ライブラリ API の包括的なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) を参照してください。
>
> **非推奨サイクル**:
>
> - 1.4.30: ロケール非依存の代替関数を実験的 API として導入
> - 1.5.0: ロケール依存の大文字/小文字変換関数を警告とともに非推奨化
> - 2.1.0: 警告をエラーに昇格

### `kotlin-stdlib-common` JAR アーティファクトの削除

> **Issue**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: binary
>
> **概要**: 以前のマルチプラットフォーム宣言メタデータに使用されていた `kotlin-stdlib-common.jar` アーティファクトは非推奨となり、共通マルチプラットフォーム宣言メタデータの標準フォーマットとして `.klib` ファイルに置き換えられます。この変更は、主要な `kotlin-stdlib.jar` や `kotlin-stdlib-all.jar` アーティファクトには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` アーティファクトを非推奨化し削除

### `appendLine()` の代わりに `appendln()` を非推奨化

> **Issue**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: source
>
> **概要**: `StringBuilder.appendln()` は `StringBuilder.appendLine()` に置き換えられ、非推奨になりました。
>
> **非推奨サイクル**:
>
> - 1.4.0: `appendln()` 関数は非推奨。使用時に警告を報告。
> - 2.1.0: 警告をエラーに昇格

### Kotlin/Native における凍結関連 API の非推奨化

> **Issue**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: source
>
> **概要**: Kotlin/Native における凍結関連 API は、以前 `@FreezingIsDeprecated` アノテーションでマークされていましたが、現在非推奨になりました。これは、スレッド共有のためのオブジェクト凍結の必要性をなくす新しいメモリマネージャの導入と整合しています。移行の詳細については、[Kotlin/Native 移行ガイド](native-migration-guide.md#update-your-code)を参照してください。
>
> **非推奨サイクル**:
>
> - 1.7.20: 凍結関連 API を警告とともに非推奨化
> - 2.1.0: 警告をエラーに昇格

### `Map.Entry` の動作を構造変更時に即時失敗 (fail-fast) するように変更

> **Issue**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: 関連するマップが構造的に変更された後に `Map.Entry` のキーと値のペアにアクセスすると、`ConcurrentModificationException` がスローされるようになりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: マップの構造変更が検出された場合に例外をスロー

## ツール

### `KotlinCompilationOutput#resourcesDirProvider` の非推奨化

> **Issue**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: `KotlinCompilationOutput#resourcesDirProvider` フィールドは非推奨になりました。追加のリソースディレクトリを追加するには、代わりに Gradle ビルドスクリプトで `KotlinSourceSet.resources` を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` は非推奨になりました

### `registerKotlinJvmCompileTask(taskName, moduleName)` 関数の非推奨化

> **Issue**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨になり、新しい `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 関数が推奨されます。この新しい関数は `KotlinJvmCompilerOptions` を受け入れ、拡張機能やターゲットなどから `compilerOptions` インスタンスを渡せるようになり、その値がタスクのオプションの規約として使用されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨になりました

### `registerKaptGenerateStubsTask(taskName)` 関数の非推奨化

> **Issue**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨になりました。代わりに新しい `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 関数を使用してください。この新しいバージョンでは、関連する `KotlinJvmCompile` タスクから値を規約としてリンクできるようになり、両方のタスクが同じオプションセットを使用することが保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨になりました

### `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースの非推奨化

> **Issue**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: behavioral
>
> **概要**: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨になり、新しい `KotlinTopLevelExtension` インターフェースが推奨されます。このインターフェースは `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension`、および `KotlinProjectExtension` を統合し、API 階層を合理化し、JVM ツールチェーンとコンパイラプロパティへの公式アクセスを提供します。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨になりました

### ビルド実行時依存関係からの `kotlin-compiler-embeddable` の削除

> **Issue**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: `kotlin-compiler-embeddable` 依存関係は、Kotlin Gradle プラグイン (KGP) の実行時環境から削除されました。必要なモジュールは KGP アーティファクトに直接含まれるようになり、Gradle Kotlin 実行時環境のバージョン 8.2 未満との互換性をサポートするために Kotlin 言語バージョンは 2.0 に制限されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-compiler-embeddable` の使用時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### Kotlin Gradle プラグイン API からコンパイラシンボルを非表示にする

> **Issue**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: `KotlinCompilerVersion` のような、Kotlin Gradle プラグイン (KGP) にバンドルされているコンパイラモジュールシンボルは、ビルドスクリプトでの意図しないアクセスを防ぐために、公開 API から非表示になります。
>
> **非推奨サイクル**:
>
> - 2.1.0: これらのシンボルへのアクセス時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### 複数の安定性設定ファイルのサポートを追加

> **Issue**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: Compose 拡張機能の `stabilityConfigurationFile` プロパティは非推奨になり、複数の設定ファイルを指定できる新しい `stabilityConfigurationFiles` プロパティが推奨されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `stabilityConfigurationFile` プロパティは非推奨になりました

### 非推奨のプラットフォームプラグイン ID の削除

> **Issue**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: source
>
> **概要**: 以下のプラットフォームプラグイン ID のサポートは削除されました。
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **非推奨サイクル**:
>
> - 1.3: プラットフォームプラグイン ID は非推奨
> - 2.1.0: プラットフォームプラグイン ID はサポートされなくなりました