[//]: # (title: Kotlin 2.1 互換性ガイド)

「[言語を現代的に保つ (Keeping the Language Modern)](kotlin-evolution-principles.md)」と「[快適なアップデート (Comfortable Updates)](kotlin-evolution-principles.md)」は、Kotlin言語設計における基本的な原則です。前者は言語の進化を妨げる構文は削除すべきであると述べ、後者はコードの移行が可能な限りスムーズになるよう、この削除は事前に十分に通知されるべきであると述べています。

ほとんどの言語変更は、更新履歴やコンパイラ警告などの他のチャネルを通じてすでに発表されていますが、このドキュメントはそれらすべてをまとめ、Kotlin 2.0からKotlin 2.1への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース互換性 (source)_: ソース非互換な変更とは、以前は問題なく（エラーや警告なしに）コンパイルされていたコードが、コンパイルできなくなる変更を指します。
- _バイナリ互換性 (binary)_: 2つのバイナリ成果物がバイナリ互換であるとは、それらを入れ替えてもロードまたはリンケージエラーが発生しない場合を指します。
- _動作互換性 (behavioral)_: ある変更が動作非互換であるとは、同じプログラムがその変更を適用する前後で異なる動作を示す場合を指します。

これらの定義は純粋なKotlinのみに与えられていることに注意してください。他の言語の視点（例えばJavaから見た）でのKotlinコードの互換性は、このドキュメントの範囲外です。

## 言語

### 言語バージョン 1.4 および 1.5 の削除

> **課題**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: Kotlin 2.1 では言語バージョン 2.1 が導入され、言語バージョン 1.4 および 1.5 のサポートが削除されます。言語バージョン 1.6 および 1.7 は非推奨になります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 言語バージョン 1.4 に対して警告を報告
> - 1.9.0: 言語バージョン 1.5 に対して警告を報告
> - 2.1.0: 言語バージョン 1.6 および 1.7 に対して警告を報告。言語バージョン 1.4 および 1.5 の警告をエラーに昇格

### Kotlin/NativeにおけるtypeOf()関数の動作変更

> **課題**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: Kotlin/Native の `typeOf()` 関数の動作が Kotlin/JVM と整合され、プラットフォーム間の一貫性が確保されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Native における `typeOf()` 関数の動作を整合

### 型パラメータの境界を介した型の公開を禁止

> **課題**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: 型パラメータの境界を介してより低い可視性の型を公開することが禁止され、型の可視性ルールにおける矛盾が解消されます。この変更により、型パラメータの境界がクラスと同じ可視性ルールに従うようになり、JVMでのIR検証エラーなどの問題が防止されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: より低い可視性を持つ型パラメータの境界を介して型を公開する場合に警告を報告
> - 2.2.0: 警告をエラーに昇格

### 抽象的なvarプロパティとvalプロパティを同じ名前で継承することを禁止

> **課題**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: クラスがインターフェースから抽象 `var` プロパティを、そしてスーパークラスから同じ名前の `val` プロパティを継承する場合、コンパイルエラーが発生するようになりました。これにより、そのようなケースでセッターが不足していることによって引き起こされるランタイムクラッシュが解決されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: クラスがインターフェースから抽象 `var` プロパティを、そしてスーパークラスから同じ名前の `val` プロパティを継承する場合に警告を報告（またはプログレッシブモードではエラー）
> - 2.2.0: 警告をエラーに昇格

### 初期化されていないEnumエントリにアクセスする際にエラーを報告

> **課題**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: コンパイラは、enumクラスまたはエントリの初期化中に初期化されていないenumエントリにアクセスされた場合にエラーを報告するようになりました。これにより、メンバープロパティの初期化ルールとの動作が整合され、ランタイム例外が防止され、一貫したロジックが保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 初期化されていないenumエントリにアクセスする際にエラーを報告

### K2におけるスマートキャスト伝播の変更

> **課題**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: K2コンパイラは、`val x = y` のように型推論された変数に対する型情報の双方向伝播を導入することで、スマートキャスト伝播の動作を変更します。`val x: T = y` のような明示的に型指定された変数は型情報を伝播しなくなり、宣言された型への厳格な準拠が保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### Javaサブクラスにおけるメンバー拡張プロパティのオーバーライドの処理を修正

> **課題**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: Javaサブクラスによってオーバーライドされたメンバー拡張プロパティのゲッターは、サブクラスのスコープで非表示になり、通常のKotlinプロパティの動作と整合されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### protected valをオーバーライドするvarプロパティのゲッターとセッターの可視性の整合を修正

> **課題**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: バイナリ
>
> **概要**: `protected val` プロパティをオーバーライドする `var` プロパティのゲッターとセッターの可視性が一貫するようになり、両方ともオーバーライドされた `val` プロパティの可視性を継承します。
>
> **非推奨サイクル**:
>
> - 2.1.0: K2においてゲッターとセッターの両方で一貫した可視性を強制。K1は影響を受けません。

### JSpecify null許容性不一致診断の重大度をエラーに引き上げ

> **課題**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `org.jspecify.annotations` からの null 許容性（Nullability）の不一致（例: `@NonNull`, `@Nullable`, `@NullMarked`）が警告ではなくエラーとして扱われるようになり、Java相互運用性（interoperability）においてより厳格な型安全性が強制されます。これらの診断の重大度を調整するには、`-Xnullability-annotations` コンパイラオプションを使用します。
>
> **非推奨サイクル**:
>
> - 1.6.0: 潜在的なnull許容性の不一致に対して警告を報告
> - 1.8.20: `@Nullable`, `@NullnessUnspecified`, `@NullMarked`、および `org.jspecify.nullness` 内のレガシーアノテーション（JSpecify 0.2以前）を含む特定のJSpecifyアノテーションに警告を拡張
> - 2.0.0: `@NonNull` アノテーションのサポートを追加
> - 2.1.0: JSpecifyアノテーションのデフォルトモードを `strict` に変更し、警告をエラーに変換。デフォルトの動作を上書きするには、`-Xnullability-annotations=@org.jspecify.annotations:warning` または `-Xnullability-annotations=@org.jspecify.annotations:ignore` を使用

### あいまいなケースでのオーバーロード解決において、invoke呼び出しよりも拡張関数を優先するように変更

> **課題**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: オーバーロード解決において、あいまいなケースではinvoke呼び出しよりも拡張関数が常に優先されるようになりました。これにより、ローカル関数とプロパティの解決ロジックにおける矛盾が解消されます。この変更は再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: シグネチャが一致する拡張関数の `invoke` 呼び出しよりも拡張関数を常に優先するようにオーバーロード解決を変更。この変更は再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません。

### JDK関数インターフェースのSAMコンストラクタにおけるラムダからのnull許容値の返却を禁止

> **課題**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: JDK関数インターフェースのSAMコンストラクタにおけるラムダからnull許容値（nullable values）を返すことが、指定された型引数が非null許容である場合にコンパイルエラーを引き起こすようになりました。これにより、null許容性の不一致がランタイム例外につながる可能性のある問題が解決され、より厳格な型安全性が確保されます。
>
> **非推奨サイクル**:
>
> - 2.0.0: JDK関数インターフェースのSAMコンストラクタにおけるnull許容戻り値に対して非推奨警告を報告
> - 2.1.0: 新しい動作をデフォルトで有効化

### Kotlin/Nativeにおけるprivateメンバーとpublicメンバーの競合処理の修正

> **課題**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: Kotlin/Nativeでは、privateメンバーがスーパークラスのpublicメンバーをオーバーライドしたり競合したりしなくなり、Kotlin/JVMの動作と整合されます。これにより、オーバーライド解決の矛盾が解消され、個別のコンパイルによって引き起こされる予期せぬ動作が排除されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Nativeにおけるprivate関数とプロパティは、スーパークラスのpublicメンバーをオーバーライドしたり影響を与えたりしなくなり、JVMの動作と整合される。

### publicインライン関数におけるprivate演算子関数へのアクセスを禁止

> **課題**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `getValue()`, `setValue()`, `provideDelegate()`, `hasNext()`, `next()` などのprivate演算子関数は、publicインライン関数内でアクセスできなくなりました。
>
> **非推奨サイクル**:
>
> - 2.0.0: publicインライン関数内でprivate演算子関数にアクセスする場合に非推奨警告を報告
> - 2.1.0: 警告をエラーに昇格

### @UnsafeVarianceアノテーションが付けられた不変パラメータへの無効な引数渡しを禁止

> **課題**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: コンパイラは型チェック中に `@UnsafeVariance` アノテーションを無視するようになり、不変型パラメータに対してより厳格な型安全性を強制します。これにより、`@UnsafeVariance` に依存して期待される型チェックをバイパスする無効な呼び出しが防止されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい動作を有効化

### 警告レベルのJava型のエラーレベルnull許容引数に対するnull許容性エラーを報告

> **課題**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: コンパイラは、警告レベルのnull許容型がより厳格なエラーレベルのnull許容性を持つ型引数を含むJavaメソッドにおけるnull許容性の不一致を検出するようになりました。これにより、以前は無視されていた型引数のエラーが正しく報告されることが保証されます。
>
> **非推奨サイクル**:
>
> - 2.0.0: より厳格な型引数を持つJavaメソッドにおけるnull許容性の不一致に対して非推奨警告を報告
> - 2.1.0: 警告をエラーに昇格

### アクセス不可能な型の暗黙的な使用を報告

> **課題**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: コンパイラは、関数リテラルや型引数におけるアクセス不可能な型の使用を報告するようになり、不完全な型情報によって引き起こされるコンパイル時およびランタイム時の失敗を防ぎます。
>
> **非推奨サイクル**:
>
> - 2.0.0: アクセス不可能な非ジェネリック型のパラメータまたはレシーバを持つ関数リテラル、およびアクセス不可能な型引数を持つ型に対して警告を報告。特定のシナリオでアクセス不可能なジェネリック型のパラメータまたはレシーバを持つ関数リテラル、およびアクセス不可能なジェネリック型引数を持つ型に対してエラーを報告
> - 2.1.0: アクセス不可能な非ジェネリック型のパラメータおよびレシーバを持つ関数リテラルの警告をエラーに昇格
> - 2.2.0: アクセス不可能な型引数を持つ型の警告をエラーに昇格

## 標準ライブラリ

### CharおよびStringのロケール依存大文字/小文字変換関数を非推奨化

> **課題**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: その他のKotlin標準ライブラリAPIの中でも、`Char` および `String` のロケール依存大文字/小文字変換関数（例: `Char.toUpperCase()` や `String.toLowerCase()`）は非推奨になりました。これらを `String.lowercase()` のようなロケール非依存の代替関数に置き換えるか、`String.lowercase(Locale.getDefault())` のようにロケール依存の動作のために明示的にロケールを指定してください。
>
> Kotlin 2.1.0で非推奨になったKotlin標準ライブラリAPIの包括的なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)を参照してください。
>
> **非推奨サイクル**:
>
> - 1.4.30: ロケール非依存の代替関数を実験的APIとして導入
> - 1.5.0: ロケール依存大文字/小文字変換関数を警告付きで非推奨化
> - 2.1.0: 警告をエラーに昇格

### kotlin-stdlib-common JARアーティファクトの削除

> **課題**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: バイナリ
>
> **概要**: 以前のマルチプラットフォーム宣言メタデータに使用されていた `kotlin-stdlib-common.jar` アーティファクトは非推奨となり、共通のマルチプラットフォーム宣言メタデータの標準フォーマットとして `.klib` ファイルに置き換えられます。この変更は、主要な `kotlin-stdlib.jar` や `kotlin-stdlib-all.jar` アーティファクトには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` アーティファクトを非推奨化し削除

### appendln() を appendLine() に置き換えて非推奨化

> **課題**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `StringBuilder.appendln()` は `StringBuilder.appendLine()` に置き換えられ、非推奨になりました。
>
> **非推奨サイクル**:
>
> - 1.4.0: `appendln()` 関数は非推奨。使用時に警告を報告
> - 2.1.0: 警告をエラーに昇格

### Kotlin/Nativeにおけるフリーズ関連APIの非推奨化

> **課題**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: 以前は `@FreezingIsDeprecated` アノテーションが付けられていたKotlin/Nativeのフリーズ関連APIが非推奨になりました。これは、スレッド共有のためのオブジェクトのフリーズの必要性をなくす新しいメモリマネージャの導入と整合するものです。移行の詳細については、[Kotlin/Native移行ガイド](native-migration-guide.md#update-your-code)を参照してください。
>
> **非推奨サイクル**:
>
> - 1.7.20: フリーズ関連APIを警告付きで非推奨化
> - 2.1.0: 警告をエラーに昇格

### Map.Entryの動作を構造変更時に即時失敗 (fail-fast) するように変更

> **課題**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: 関連するマップが構造的に変更された後に `Map.Entry` のキーと値のペアにアクセスすると、`ConcurrentModificationException` がスローされるようになりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: マップの構造変更が検出された場合に例外をスロー

## ツール

### KotlinCompilationOutput#resourcesDirProviderの非推奨化

> **課題**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `KotlinCompilationOutput#resourcesDirProvider` フィールドは非推奨になりました。代わりにGradleビルドスクリプトで `KotlinSourceSet.resources` を使用して追加のリソースディレクトリを追加してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` は非推奨

### registerKotlinJvmCompileTask(taskName, moduleName) 関数の非推奨化

> **課題**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨になり、新しい `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 関数に置き換えられます。この新しい関数は `KotlinJvmCompilerOptions` を受け入れるようになりました。これにより、通常は拡張またはターゲットから取得した `compilerOptions` インスタンスを渡し、タスクのオプションの規約として値を使用できます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨

### registerKaptGenerateStubsTask(taskName) 関数の非推奨化

> **課題**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨になりました。代わりに新しい `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 関数を使用してください。この新しいバージョンでは、関連する `KotlinJvmCompile` タスクから値を規約としてリンクできるため、両方のタスクが同じオプションセットを使用することが保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨

### KotlinTopLevelExtensionおよびKotlinTopLevelExtensionConfigインターフェースの非推奨化

> **課題**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: 動作
>
> **概要**: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨になり、新しい `KotlinTopLevelExtension` インターフェースに置き換えられます。このインターフェースは `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension`、および `KotlinProjectExtension` を統合し、API階層を合理化し、JVMツールチェーンとコンパイラのプロパティへの公式なアクセスを提供します。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨

### ビルドランタイム依存関係からkotlin-compiler-embeddableを削除

> **課題**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `kotlin-compiler-embeddable` 依存関係はKotlin Gradleプラグイン（KGP）のランタイムから削除されます。必要なモジュールはKGPアーティファクトに直接含まれるようになり、Gradle Kotlinランタイムの8.2未満のバージョンとの互換性をサポートするために、Kotlin言語バージョンは2.0に制限されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-compiler-embeddable` の使用時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### Kotlin GradleプラグインAPIからコンパイラシンボルを非表示

> **課題**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: `KotlinCompilerVersion` など、Kotlin Gradleプラグイン（KGP）にバンドルされているコンパイラモジュールシンボルは、ビルドスクリプトでの意図しないアクセスを防ぐためにパブリックAPIから非表示になります。
>
> **非推奨サイクル**:
>
> - 2.1.0: これらのシンボルへのアクセス時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### 複数の安定性設定ファイルのサポートを追加

> **課題**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: Compose拡張の `stabilityConfigurationFile` プロパティは非推奨になり、複数の設定ファイルを指定できる新しい `stabilityConfigurationFiles` プロパティに置き換えられます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `stabilityConfigurationFile` プロパティは非推奨

### 非推奨のプラットフォームプラグインIDの削除

> **課題**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更タイプ**: ソース
>
> **概要**: 以下のプラットフォームプラグインIDのサポートが削除されました:
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **非推奨サイクル**:
>
> - 1.3: プラットフォームプラグインIDは非推奨
> - 2.1.0: プラットフォームプラグインIDはサポートされなくなります