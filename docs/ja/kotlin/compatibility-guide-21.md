[//]: # (title: Kotlin 2.1.x の互換性ガイド)

「[言語をモダンに保つ](kotlin-evolution-principles.md)」および「[快適なアップデート](kotlin-evolution-principles.md)」は、Kotlin の言語設計における基本的な原則です。前者は言語の進化を妨げる構文を削除すべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、その削除を事前に十分に周知すべきであることを示しています。

ほとんどの言語の変更は、アップデートの変更ログやコンパイラの警告などの他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらをすべてまとめ、Kotlin 2.0 から Kotlin 2.1 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、数種類の互換性について紹介します。

- **ソース（source）**: ソース互換性のない（source-incompatible）変更は、以前は問題なくコンパイルできていた（エラーや警告が出ていなかった）コードがコンパイルできなくなる変更を指します。
- **バイナリ（binary）**: 2 つのバイナリアーティファクトを入れ替えてもロードエラーやリンクエラーが発生しない場合、それらはバイナリ互換（binary-compatible）であると言います。
- **振る舞い（behavioral）**: 同じプログラムが変更の適用前後で異なる動作を示す場合、その変更は振る舞いの互換性のない（behavioral-incompatible）変更であると言います。

これらの定義は、純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語 (Language)

### 言語バージョン 1.4 および 1.5 の削除

> **課題**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 2.1 では言語バージョン 2.1 が導入され、言語バージョン 1.4 および 1.5 のサポートが削除されました。言語バージョン 1.6 および 1.7 は非推奨（deprecated）となります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 言語バージョン 1.4 に対して警告を報告
> - 1.9.0: 言語バージョン 1.5 に対して警告を報告
> - 2.1.0: 言語バージョン 1.6 および 1.7 に対して警告を報告。言語バージョン 1.4 および 1.5 に対する警告をエラーに引き上げ

### Kotlin/Native における typeOf() 関数の振る舞いの変更

> **課題**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin/Native における `typeOf()` 関数の振る舞いが、プラットフォーム間の整合性を確保するために Kotlin/JVM と合わせられました。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Native における `typeOf()` 関数の振る舞いを調整

### 型パラメータの境界を通じた型の公開の禁止

> **課題**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 型の可視性ルールの不整合に対処するため、型パラメータの境界（bounds）を通じて、より低い可視性を持つ型を公開することが禁止されました。この変更により、型パラメータの境界がクラスと同じ可視性ルールに従うことが保証され、JVM における IR 検証エラーなどの問題が防止されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: より低い可視性を持つ型を型パラメータの境界を通じて公開している場合に警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### 同名の抽象 var プロパティと val プロパティの継承を禁止

> **課題**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: インターフェースから抽象 `var` プロパティを継承し、スーパークラスから同名の `val` プロパティを継承している場合、コンパイルエラーが発生するようになりました。これにより、そのようなケースでセッターが不足しているために発生していた実行時のクラッシュが解決されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: インターフェースから抽象 `var` プロパティを、スーパークラスから同名の `val` プロパティを継承している場合に警告を報告（プログレッシブモードではエラー）
> - 2.2.0: 警告をエラーに引き上げ

### 初期化されていない enum エントリへのアクセス時にエラーを報告

> **課題**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: enum クラスまたはエントリの初期化中に、初期化されていない enum エントリにアクセスした際、コンパイラがエラーを報告するようになりました。これにより、振る舞いがメンバプロパティの初期化ルールと一致し、実行時の例外を防止し、一貫したロジックが保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 初期化されていない enum エントリへのアクセス時にエラーを報告

### K2 スマートキャストの伝播における変更

> **課題**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: K2 コンパイラでは、`val x = y` のような推論される変数に対して型情報の双方向伝播を導入することで、スマートキャストの伝播の振る舞いを変更しました。`val x: T = y` のように明示的に型指定された変数は、型情報を伝播しなくなり、宣言された型へのより厳密な準拠が保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい振る舞いを有効化

### Java サブクラスにおけるメンバ拡張プロパティのオーバーライド処理の修正

> **課題**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Java サブクラスによってオーバーライドされたメンバ拡張プロパティのゲッターが、サブクラスのスコープ内で非表示になるようになり、通常の Kotlin プロパティの振る舞いと一致するようになりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい振る舞いを有効化

### protected val をオーバーライドする var プロパティのゲッターとセッターの可視性の整合性を修正

> **課題**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: バイナリ
> 
> **概要**: `protected val` プロパティをオーバーライドする `var` プロパティのゲッターとセッターの可視性が一貫するようになり、両方がオーバーライドされた `val` プロパティの可視性を継承するようになりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: K2 において、ゲッターとセッターの両方に一貫した可視性を強制。K1 は影響を受けません。

### JSpecify の Null 許容性不一致診断の重要度をエラーに引き上げ

> **課題**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `@NonNull`、`@Nullable`、`@NullMarked` などの `org.jspecify.annotations` 由来の Null 許容性（nullability）の不一致が、警告ではなくエラーとして扱われるようになりました。これにより、Java との相互運用性におけるより厳密な型安全性が強制されます。これらの診断の重要度を調整するには、`-Xnullability-annotations` コンパイラオプションを使用してください。
>
> **非推奨サイクル**:
>
> - 1.6.0: 潜在的な Null 許容性の不一致に対して警告を報告
> - 1.8.20: `@Nullable`、`@NullnessUnspecified`、`@NullMarked`、および `org.jspecify.nullness`（JSpecify 0.2 以前）のレガシーアノテーションを含む特定の JSpecify アノテーションに警告を拡大
> - 2.0.0: `@NonNull` アノテーションのサポートを追加
> - 2.1.0: JSpecify アノテーションのデフォルトモードを `strict` に変更し、警告をエラーに変換。デフォルトの動作を上書きするには、`-Xnullability-annotations=@org.jspecify.annotations:warning` または `-Xnullability-annotations=@org.jspecify.annotations:ignore` を使用

### 曖昧なケースにおいて invoke 呼び出しよりも拡張関数を優先するようにオーバーロード解決を変更

> **課題**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
> 
> **概要**: 曖昧なケースにおけるオーバーロード解決（overload resolution）において、一貫して `invoke` 呼び出しよりも拡張関数が優先されるようになりました。これにより、ローカル関数やプロパティの解決ロジックにおける不整合が解決されます。この変更は再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: 一致するシグネチャを持つ拡張関数について、`invoke` 呼び出しよりも一貫して拡張関数を優先するようにオーバーロード解決を変更。この変更は再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません。

### JDK 関数インターフェースの SAM コンストラクタ内のラムダから Null 許容値を返すことを禁止

> **課題**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
> 
> **概要**: 指定された型引数が Null 非許容である場合、JDK 関数インターフェースの SAM コンストラクタ内のラムダから Null 許容値を返すとコンパイルエラーが発生するようになりました。これにより、Null 許容性の不一致が実行時例外につながる可能性があった問題が解決され、より厳密な型安全性が確保されます。
>
> **非推奨サイクル**:
>
> - 2.0.0: JDK 関数インターフェースの SAM コンストラクタにおける Null 許容の戻り値に対して非推奨の警告を報告
> - 2.1.0: デフォルトで新しい振る舞いを有効化

### Kotlin/Native におけるパブリックメンバと競合するプライベートメンバの処理の修正

> **課題**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: 振る舞い
> 
> **概要**: Kotlin/Native において、プライベートメンバがスーパークラスのパブリックメンバをオーバーライドしたり競合したりしなくなり、Kotlin/JVM と振る舞いが一致するようになりました。これにより、オーバーライド解決における不整合が解決され、分割コンパイルによって引き起こされる予期しない動作が排除されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: Kotlin/Native のプライベート関数およびプロパティがスーパークラスのパブリックメンバをオーバーライドしたり影響を与えたりしなくなり、JVM の振る舞いと一致

### パブリックなインライン関数内でのプライベートな演算子関数へのアクセスを禁止

> **課題**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()`、`next()` などのプライベートな演算子関数（operator functions）に、パブリックなインライン関数内からアクセスできなくなりました。
>
> **非推奨サイクル**:
>
> - 2.0.0: パブリックなインライン関数内でのプライベートな演算子関数へのアクセスに対して非推奨の警告を報告
> - 2.1.0: 警告をエラーに引き上げ

### @UnsafeVariance がアノテーションされた不変パラメータへの無効な引数の受け渡しを禁止

> **課題**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: コンパイラが型チェック中に `@UnsafeVariance` アノテーションを無視するようになり、不変（invariant）な型パラメータに対してより厳密な型安全性が強制されるようになりました。これにより、期待される型チェックをバイパスするために `@UnsafeVariance` に依存する無効な呼び出しが防止されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 新しい振る舞いを有効化

### 警告レベルの Java 型のエラーレベルの Null 許容引数に対する Null 許容性エラーを報告

> **課題**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 警告レベルの Null 許容型に、より厳格なエラーレベルの Null 許容性を持つ型引数が含まれている Java メソッドにおいて、コンパイラが Null 許容性の不一致を検出するようになりました。これにより、以前は無視されていた型引数内のエラーが正しく報告されるようになります。
>
> **非推奨サイクル**:
>
> - 2.0.0: より厳密な型引数を持つ Java メソッドにおける Null 許容性の不一致に対して非推奨の警告を報告
> - 2.1.0: 警告をエラーに引き上げ

### アクセス不可能な型の暗黙的な使用を報告

> **課題**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 関数リテラルや型引数におけるアクセス不可能な型（inaccessible types）の使用をコンパイラが報告するようになりました。これにより、不完全な型情報によって引き起こされるコンパイルエラーや実行時の失敗が防止されます。
>
> **非推奨サイクル**:
>
> - 2.0.0: アクセス不可能な非ジェネリック型をパラメータまたはレシーバに持つ関数リテラル、およびアクセス不可能な型引数を持つ型に対して警告を報告。特定のシナリオにおいて、アクセス不可能なジェネリック型をパラメータまたはレシーバに持つ関数リテラル、およびアクセス不可能なジェネリック型引数を持つ型に対してエラーを報告
> - 2.1.0: アクセス不可能な非ジェネリック型をパラメータまたはレシーバに持つ関数リテラルに対する警告をエラーに引き上げ
> - 2.2.0: アクセス不可能な型引数を持つ型に対する警告をエラーに引き上げ

## 標準ライブラリ (Standard library)

### Char および String のロケール依存のケース変換関数の非推奨化

> **課題**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 他の Kotlin 標準ライブラリ API と同様に、`Char.toUpperCase()` や `String.toLowerCase()` などのロケール依存のケース（大文字・小文字）変換関数が非推奨となりました。これらを `String.lowercase()` などのロケールに依存しない代替手段に置き換えるか、ロケール依存の動作が必要な場合は `String.lowercase(Locale.getDefault())` のようにロケールを明示的に指定してください。
>
> Kotlin 2.1.0 で非推奨となった Kotlin 標準ライブラリ API の包括的なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) を参照してください。
>
> **非推奨サイクル**:
>
> - 1.4.30: ロケールに依存しない代替手段を試験的（experimental）API として導入
> - 1.5.0: ロケール依存のケース変換関数を警告付きで非推奨化
> - 2.1.0: 警告をエラーに引き上げ

### kotlin-stdlib-common JAR アーティファクトの削除

> **課題**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: バイナリ
>
> **概要**: 以前、レガシーなマルチプラットフォーム宣言のメタデータに使用されていた `kotlin-stdlib-common.jar` アーティファクトは非推奨となり、共通マルチプラットフォーム宣言メタデータの標準フォーマットとして `.klib` ファイルに置き換えられました。この変更は、メインの `kotlin-stdlib.jar` や `kotlin-stdlib-all.jar` アーティファクトには影響しません。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` アーティファクトを非推奨化し削除

### appendLine() を優先し appendln() を非推奨化

> **課題**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `StringBuilder.appendln()` は `StringBuilder.appendLine()` を優先するため非推奨となりました。
>
> **非推奨サイクル**:
>
> - 1.4.0: `appendln()` 関数を非推奨化。使用時に警告を報告
> - 2.1.0: 警告をエラーに引き上げ

### Kotlin/Native における Freezing 関連 API の非推奨化

> **課題**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 以前 `@FreezingIsDeprecated` アノテーションが付けられていた Kotlin/Native の Freezing 関連 API が正式に非推奨となりました。これは、スレッド間でのオブジェクト共有のためにオブジェクトをフリーズさせる必要をなくした新しいメモリマネージャの導入に伴うものです。移行の詳細については、[Kotlin/Native 移行ガイド](native-migration-guide.md#update-your-code)を参照してください。
>
> **非推奨サイクル**:
>
> - 1.7.20: Freezing 関連 API を警告付きで非推奨化
> - 2.1.0: 警告をエラーに引き上げ

### 構造的な変更時にフェイルファストするように Map.Entry の振る舞いを変更

> **課題**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: 関連付けられたマップが構造的に変更された後に `Map.Entry` のキーと値のペアにアクセスすると、`ConcurrentModificationException` がスローされるようになりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: マップの構造的な変更が検出された場合に例外をスロー

## ツール (Tools)

### KotlinCompilationOutput#resourcesDirProvider の非推奨化

> **課題**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `KotlinCompilationOutput#resourcesDirProvider` フィールドが非推奨となりました。リソースディレクトリを追加するには、Gradle ビルドスクリプトで代わりに `KotlinSourceSet.resources` を使用してください。
> 
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` が非推奨

### registerKotlinJvmCompileTask(taskName, moduleName) 関数の非推奨化

> **課題**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は、新たに `KotlinJvmCompilerOptions` を受け取る `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 関数を優先するため、非推奨となりました。これにより、通常は拡張機能やターゲットから取得した `compilerOptions` インスタンスを渡すことができ、その値がタスクのオプションのコンベンションとして使用されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数が非推奨

### registerKaptGenerateStubsTask(taskName) 関数の非推奨化

> **課題**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `registerKaptGenerateStubsTask(taskName)` 関数が非推奨となりました。代わりに新しい `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 関数を使用してください。この新バージョンでは、関連する `KotlinJvmCompile` タスクから値をコンベンションとしてリンクできるため、両方のタスクで同じオプションセットが使用されることが保証されます。
>
> **非推奨サイクル**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 関数が非推奨

### KotlinTopLevelExtension および KotlinTopLevelExtensionConfig インターフェースの非推奨化

> **課題**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは、新しい `KotlinTopLevelExtension` インターフェースを優先するため非推奨となりました。このインターフェースは `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension`、および `KotlinProjectExtension` を統合し、API 階層を合理化するとともに、JVM ツールチェーンおよびコンパイラプロパティへの公式なアクセスを提供します。
>
> **非推奨サイクル**:
>
> - 2.1.0: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースが非推奨

### ビルド実行時の依存関係から kotlin-compiler-embeddable を削除

> **課題**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin Gradle プラグイン（KGP）のランタイムから `kotlin-compiler-embeddable` 依存関係が削除されました。必要なモジュールは KGP アーティファクトに直接含まれるようになり、8.2 未満のバージョンの Gradle Kotlin ランタイムとの互換性をサポートするために Kotlin 言語バージョンは 2.0 に制限されています。
>
> **非推奨サイクル**:
>
> - 2.1.0: `kotlin-compiler-embeddable` の使用に対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### Kotlin Gradle プラグイン API からコンパイラシンボルを隠蔽

> **課題**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `KotlinCompilerVersion` など、Kotlin Gradle プラグイン（KGP）内にバンドルされているコンパイラモジュールのシンボルが、ビルドスクリプトからの意図しないアクセスを防ぐためにパブリック API から隠蔽されました。
>
> **非推奨サイクル**:
>
> - 2.1.0: これらのシンボルへのアクセスに対して警告を報告
> - 2.2.0: 警告をエラーに引き上げ

### 複数の安定性設定ファイルのサポートを追加

> **課題**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Compose 拡張機能の `stabilityConfigurationFile` プロパティは、複数の設定ファイルを指定できる新しい `stabilityConfigurationFiles` プロパティを優先するため、非推奨となりました。
>
> **非推奨サイクル**:
>
> - 2.1.0: `stabilityConfigurationFile` プロパティが非推奨

### 非推奨のプラットフォームプラグイン ID の削除

> **課題**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 以下のプラットフォームプラグイン ID のサポートが削除されました。
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **非推奨サイクル**:
>
> - 1.3: プラットフォームプラグイン ID を非推奨化
> - 2.1.0: プラットフォームプラグイン ID のサポートを終了