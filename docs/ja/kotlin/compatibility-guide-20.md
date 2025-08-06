[//]: # (title: Kotlin 2.0 互換性ガイド)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ および _[Comfortable Updates](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則の1つです。前者は、言語の進化を妨げる構文は削除されるべきであると述べており、後者は、コード移行を可能な限りスムーズにするために、この削除が事前に十分に通知されるべきであると述べています。

言語の変更のほとんどは、更新された変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントはKotlin 1.9からKotlin 2.0への移行に関する完全なリファレンスを提供します。

> Kotlin K2コンパイラはKotlin 2.0の一部として導入されます。新しいコンパイラの利点、移行中に遭遇する可能性のある変更点、および以前のコンパイラに戻す方法については、[K2コンパイラ移行ガイド](k2-compiler-migration-guide.md)を参照してください。
>
{style="note"}

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース_: ソース非互換な変更とは、以前は問題なく（エラーや警告なしで）コンパイルされていたコードが、もはやコンパイルできなくなる変更です。
- _バイナリ_: 2つのバイナリ成果物は、それらを入れ替えてもロードエラーやリンクエラーが発生しない場合に、バイナリ互換であると言われます。
- _振る舞い_: 振る舞い非互換な変更とは、同じプログラムが変更適用前と後で異なる振る舞いを示す場合を指します。

これらの定義は純粋なKotlinのみに適用されることに留意してください。他の言語の視点（例えばJava）から見たKotlinコードの互換性は、このドキュメントの範囲外です。

## 言語

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### プロジェクトされたレシーバー上での合成セッターの使用を非推奨化

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Javaクラスの合成セッターを使用して、クラスのプロジェクトされた型と競合する型を割り当てると、エラーが発生します。
>
> **Deprecation cycle**:
>
> - 1.8.20: 合成プロパティセッターが反変位置にプロジェクトされたパラメータ型を持ち、呼び出しサイトの引数型が非互換になる場合に警告を報告
> - 2.0.0: 警告をエラーに昇格

### Javaサブクラスでオーバーロードされているインラインクラスパラメータを持つ関数を呼び出す際のマングリングの修正

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 関数呼び出しで正しいマングリング動作を使用。以前の動作に戻すには、`-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` コンパイラオプションを使用します。

### 反変キャプチャ型に対する型近似アルゴリズムの修正

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 問題のある呼び出しに対して警告を報告
> - 2.0.0: 警告をエラーに昇格

### プロパティ初期化前のプロパティ値へのアクセスを禁止

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 影響を受けるコンテキストでプロパティが初期化前にアクセスされた場合にエラーを報告

### 同じ名前のインポートされたクラスに曖昧性がある場合にエラーを報告

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: スターインポートでインポートされた複数のパッケージに存在するクラス名を解決する際にエラーを報告

### Kotlinラムダをデフォルトで `invokedynamic` と `LambdaMetafactory` 経由で生成

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。ラムダはデフォルトで`invokedynamic`と`LambdaMetafactory`を使用して生成されます。

### 式が必要な場合に単一ブランチの `if` 条件を禁止

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: `if`条件が単一ブランチしか持たない場合にエラーを報告

### ジェネリック型のスタープロジェクションを渡すことによる自己上限の違反を禁止

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリック型のスタープロジェクションを渡すことで自己上限が違反された場合にエラーを報告

### プライベートインライン関数の戻り値型の匿名型を近似

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 推論された戻り値型が匿名型を含むプライベートインライン関数に対して警告を報告
> - 2.0.0: そのようなプライベートインライン関数の戻り値型をスーパータイプに近似

### ローカル関数型プロパティのinvoke規約よりもローカル拡張関数呼び出しを優先するようにオーバーロード解決の振る舞いを変更

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しいオーバーロード解決の動作。関数呼び出しがinvoke規約よりも一貫して優先されます。

### バイナリ依存関係からのスーパータイプにおける変更が原因で継承メンバーの競合が発生した場合にエラーを報告

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: バイナリ依存関係からのスーパータイプで継承メンバーの競合が発生した宣言に対して警告 `CONFLICTING_INHERITED_MEMBERS_WARNING` を報告
> - 2.0.0: 警告をエラー `CONFLICTING_INHERITED_MEMBERS` に昇格

### 不変型におけるパラメータの `@UnsafeVariance` アノテーションを無視

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。反変パラメータにおける型不一致に関するエラーを報告する際に、`@UnsafeVariance`アノテーションは無視されます。

### コンパニオンオブジェクトのメンバーへの呼び出し外参照の型を変更

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: コンパニオンオブジェクト関数参照の型が非束縛参照として推論された場合に警告を報告
> - 2.0.0: すべての使用コンテキストでコンパニオンオブジェクト関数参照が束縛参照として推論されるように動作を変更

### プライベートインライン関数からの匿名型の露出を禁止

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: プライベートインライン関数から返される匿名オブジェクトの自身のメンバーへの呼び出しに対して警告を報告
> - 2.0.0: そのようなプライベートインライン関数の戻り値型をスーパータイプに近似し、匿名オブジェクトメンバーへの呼び出しを解決しない

### whileループのbreak後の不健全なスマートキャストに対してエラーを報告

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。以前の動作は言語バージョン1.9に切り替えることで復元できます。

### 交差型の変数がその交差型のサブタイプではない値に割り当てられた場合にエラーを報告

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 交差型を持つ変数がその交差型のサブタイプではない値に割り当てられた場合にエラーを報告

### SAMコンストラクタで構築されたインターフェースがオプトインを必要とするメソッドを含む場合にオプトインを要求

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: SAMコンストラクタを介した `OptIn` の使用に対して警告を報告
> - 2.0.0: SAMコンストラクタを介した `OptIn` の使用に対して警告をエラーに昇格（または`OptIn`マーカーの重要度が警告の場合は警告を報告し続ける）

### 型エイリアスコンストラクタにおける上限違反を禁止

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 型エイリアスコンストラクタで上限が違反されるケースに対して警告を導入
> - 2.0.0: K2コンパイラで警告をエラーに昇格

### 分解宣言変数の実型を明示的な型が指定された場合に一貫させる

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。分解宣言変数の実型は、明示的な型が指定された場合に一貫するようになりました。

### デフォルト値を持つパラメータ型がオプトインを必要とするコンストラクタを呼び出す場合にオプトインを要求

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: オプトインを必要とするパラメータ型を持つコンストラクタ呼び出しに対して警告を報告
> - 2.0.0: 警告をエラーに昇格（または`OptIn`マーカーの重要度が警告の場合は警告を報告し続ける）

### 同じスコープレベルで同じ名前のプロパティとenumエントリの間に曖昧性がある場合にエラーを報告

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: コンパイラが同じスコープレベルでenumエントリの代わりにプロパティに解決する場合に警告を報告
> - 2.0.0: K2コンパイラで、コンパイラが同じスコープレベルで同じ名前のプロパティとenumエントリの両方を検出した場合に曖昧性を報告（古いコンパイラでは警告のまま）

### enumエントリよりもコンパニオンプロパティを優先するように限定子解決の振る舞いを変更

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい解決動作を実装。コンパニオンプロパティがenumエントリよりも優先されます。

### invoke呼び出しレシーバー型とinvoke関数型を脱糖形式で書かれたかのように解決

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: invoke呼び出しレシーバー型とinvoke関数型を、それらが脱糖形式で書かれたかのように独立して解決

### 非プライベートインライン関数を介してプライベートクラスメンバーを公開することを禁止

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 内部インライン関数からプライベートクラスのコンパニオンオブジェクトメンバーを呼び出す際に、`PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告を報告
> - 2.0.0: この警告を `PRIVATE_CLASS_MEMBER_FROM_INLINE` エラーに昇格

### プロジェクトされたジェネリック型における確実に非ヌル型のヌル許容性を修正

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。プロジェクトされた型は、すべてのインプレースの非ヌル型を考慮するようになりました。

### 前置インクリメントの推論型を `inc()` 演算子の戻り値型ではなくゲッターの戻り値型に合わせるように変更

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。前置インクリメントの推論型は、`inc()`演算子の戻り値型ではなくゲッターの戻り値型に合わせるように変更されます。

### スーパークラスで宣言されたジェネリックな内部クラスから内部クラスを継承する際にバウンドチェックを強制

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリックなスーパータイプの型パラメータの上限が違反された場合にエラーを報告

### 期待される型が関数型パラメータを持つ関数型である場合に、SAM型を持つcallable参照の割り当てを禁止

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 期待される型が関数型パラメータを持つ関数型である場合に、SAM型を持つcallable参照に対してコンパイルエラーを報告

### コンパニオンオブジェクト上のアノテーション解決のためにコンパニオンオブジェクトスコープを考慮

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。コンパニオンオブジェクト上のアノテーション解決中にコンパニオンオブジェクトスコープが無視されなくなりました。

### セーフコールと規約演算子の組み合わせの評価セマンティクスを変更

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: 各不正な呼び出しに対して警告を報告
> - 2.0.0: 新しい解決動作を実装

### バッキングフィールドとカスタムセッターを持つプロパティが即座に初期化されることを要求

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: プライマリコンストラクタがない場合に `MUST_BE_INITIALIZED` 警告を導入
> - 2.0.0: 警告をエラーに昇格

### invoke演算子規約呼び出しにおける任意の式に対するUnit変換を禁止

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 変数およびinvoke解決における任意の式にUnit変換が適用された場合にエラーを報告。影響を受ける式で以前の動作を維持するには、`-XXLanguage:+UnitConversionsOnArbitraryExpressions` コンパイラオプションを使用します。

### フィールドがセーフコールでアクセスされる場合に、ヌル許容な値を非ヌルなJavaフィールドに割り当てることを禁止

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ヌル許容な値が非ヌルなJavaフィールドに割り当てられた場合にエラーを報告

### raw型パラメータを含むJavaメソッドをオーバーライドする際にスタープロジェクション型を要求

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。raw型パラメータに対するオーバーライドは禁止されます。

### Vがコンパニオンを持つ場合の `(V)::foo` 参照解決を変更

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: 現在コンパニオンオブジェクトインスタンスに束縛されているcallable参照に対して警告を報告
> - 2.0.0: 新しい動作を実装。型を括弧で囲むことが、もはやその型のコンパニオンオブジェクトインスタンスへの参照とはなりません。

### 実質的に公開なインライン関数における暗黙的な非公開APIアクセスを禁止

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 公開インライン関数で暗黙的な非公開APIにアクセスされた場合にコンパイル警告を報告
> - 2.0.0: 警告をエラーに昇格

### プロパティゲッターにおけるユースサイトの `get` アノテーションを禁止

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: ゲッターにおけるユースサイトの `get` アノテーションに対して警告（プログレッシブモードではエラー）を報告
> - 2.0.0: 警告を `INAPPLICABLE_TARGET_ON_PROPERTY` エラーに昇格。警告に戻すには `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` を使用します。

### ビルダー推論ラムダ関数における型パラメータの上限への暗黙的な推論を防止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 型引数の型パラメータが宣言された上限に推論できない場合に警告（またはプログレッシブモードではエラー）を報告
> - 2.0.0: 警告をエラーに昇格

### 公開シグネチャにおけるローカル型の近似時にヌル許容性を保持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 柔軟な型は柔軟なスーパータイプによって近似されます。宣言がヌル許容であるべき非ヌル許容型として推論され、`NullPointerException`を避けるために型を明示的に指定するように促す警告を報告
> - 2.0.0: ヌル許容型はヌル許容スーパータイプによって近似されます。

### スマートキャスト目的での `false && ...` および `false || ...` に対する特別な処理を削除

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装。`false && ...` および `false || ...` に対する特別な処理は行われません。

### enumにおけるインラインopen関数を禁止

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: enumにおけるインラインopen関数に対して警告を報告
> - 2.0.0: 警告をエラーに昇格

## ツール

### Gradleにおける可視性の変更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以前は、特定のDSLコンテキストを意図したKotlin DSL関数やプロパティが、意図せず他のDSLコンテキストに漏洩していました。私たちは `@KotlinGradlePluginDsl` アノテーションを追加し、Kotlin GradleプラグインのDSL関数やプロパティが、利用されるべきではないレベルに露出するのを防ぎます。以下のレベルは相互に分離されています。
> * Kotlin拡張
> * Kotlinターゲット
> * Kotlinコンパイル
> * Kotlinコンパイルタスク
>
> **Deprecation cycle**:
>
> - 2.0.0: ほとんどの一般的なケースでは、ビルドスクリプトが誤って設定されている場合に、コンパイラは修正方法の提案を含む警告を報告します。それ以外の場合は、コンパイラはエラーを報告します。

### `kotlinOptions` DSLの廃止

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlinOptions` DSLおよび関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介してコンパイラオプションを設定する機能が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告

### `KotlinCompilation` DSLにおける `compilerOptions` の廃止

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilation` DSLにおける `compilerOptions` プロパティを設定する機能が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告

### CInteropProcessの古い取り扱い方法の削除

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` タスクと `CInteropSettings` クラスは、`defFile` と `defFileProperty` の代わりに `definitionFile` プロパティを使用するようになりました。
>
> これにより、`defFile` が動的に生成される場合に、`CInteropProcess` タスクと `defFile` を生成するタスクとの間に余分な `dependsOn` 関係を追加する必要がなくなります。
>
> Kotlin/Nativeプロジェクトでは、Gradleは、接続されたタスクがビルドプロセスの後半で実行された後、`definitionFile` プロパティの存在を遅延検証するようになりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` および `defFileProperty` パラメータが非推奨になりました。

### `kotlin.useK2` Gradleプロパティの削除

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradleプロパティが削除されました。Kotlin 1.9.*ではK2コンパイラを有効にするために使用できましたが、Kotlin 2.0.0以降ではK2コンパイラがデフォルトで有効になっているため、このプロパティは効果がなく、以前のコンパイラに戻すために使用することはできません。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradleプロパティは非推奨になりました。
> - 2.0.0: `kotlin.useK2` Gradleプロパティは削除されました。

### 廃止されたプラットフォームプラグインIDの削除

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以下のプラットフォームプラグインIDのサポートが削除されました。
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: プラットフォームプラグインIDは非推奨になりました。
> - 2.0.0: プラットフォームプラグインIDはもはやサポートされません。

### `outputFile` JavaScriptコンパイラオプションの削除

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScriptコンパイラオプションが削除されました。代わりに、`Kotlin2JsCompile` タスクの `destinationDirectory` プロパティを使用して、コンパイルされたJavaScript出力ファイルが書き込まれるディレクトリを指定できます。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` コンパイラオプションは非推奨になりました。
> - 2.0.0: `outputFile` コンパイラオプションは削除されました。