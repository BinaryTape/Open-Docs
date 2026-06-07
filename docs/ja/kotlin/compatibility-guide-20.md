[//]: # (title: Kotlin 2.0.x 互換性ガイド)

「[言語をモダンに保つ](kotlin-evolution-principles.md)」と「[快適なアップデート](kotlin-evolution-principles.md)」は、Kotlin 言語設計における基本的な原則です。前者は言語の進化を妨げる構成要素は削除されるべきであることを意味し、後者は、コードの移行を可能な限りスムーズにするために、その削除について事前に十分に周知されるべきであることを意味しています。

ほとんどの言語変更は、更新されたチェンジログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントは Kotlin 1.9 から Kotlin 2.0 への移行に関する完全なリファレンスを提供します。

> Kotlin K2 コンパイラは Kotlin 2.0 の一部として導入されました。新しいコンパイラの利点、移行中に遭遇する可能性のある変更点、および以前のコンパイラにロールバックする方法については、「[K2 コンパイラ移行ガイド](k2-compiler-migration-guide.md)」を参照してください。
>
{style="note"}

## 基本用語

このドキュメントでは、数種類の互換性について紹介します。

- _source（ソース）_: ソース互換性のない変更は、以前は正常にコンパイルできていた（エラーや警告がなかった）コードがコンパイルできなくなることを指します。
- _binary（バイナリ）_: 2つのバイナリアーティファクトを入れ替えても、ロードエラーやリンクエラーが発生しない場合、それらはバイナリ互換であると言われます。
- _behavioral（振る舞い）_: 変更を適用する前後で、同じプログラムが異なる動作を示す場合、その変更は振る舞いの互換性がないと言われます。

これらの定義は純粋な Kotlin に対してのみ適用されることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語（Language）

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

### プロジェクションされたレシーバーにおけるシンセティックセッターの使用を非推奨化

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Java クラスのシンセティックセッター（synthetic setter）を使用して、そのクラスのプロジェクションされた型と矛盾する型を代入しようとすると、エラーが発生します。
>
> **Deprecation cycle**:
>
> - 1.8.20: シンセティックプロパティセッターが、コールサイトの引数型を互換性のないものにする反変（contravariant）な位置のプロジェクションされたパラメータ型を持つ場合、警告を報告します
> - 2.0.0: 警告をエラーに引き上げます

### Java のサブクラスでオーバーロードされたインラインクラスのパラメータを持つ関数を呼び出す際の、マングリングの修正

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 関数呼び出しにおいて正しいマングリングの振る舞いを使用します。以前の振る舞いに戻すには、`-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` コンパイラオプションを使用してください。

### 反変なキャプチャされた型に対する型近似アルゴリズムの修正

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 問題のある呼び出しに対して警告を報告します
> - 2.0.0: 警告をエラーに引き上げます

### プロパティの初期化前のプロパティ値へのアクセスを禁止

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 影響を受けるコンテキストにおいて、プロパティが初期化される前にアクセスされた場合にエラーを報告します

### スターインポートされた同名のクラスに曖昧さがある場合にエラーを報告

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: スターインポート（*）によってインポートされた複数のパッケージに存在するクラス名を解決する際に、曖昧さがある場合にエラーを報告します

### デフォルトで invokedynamic および LambdaMetafactory を使用して Kotlin ラムダを生成

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。ラムダはデフォルトで `invokedynamic` および `LambdaMetafactory` を使用して生成されます

### 式が必要な場合にブランチが1つしかない if 条件を禁止

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: `if` 条件にブランチ（枝）が1つしかない場合にエラーを報告します

### ジェネリック型のスタープロジェクションを渡すことによる自己上限（self upper bounds）の違反を禁止

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリック型のスタープロジェクションを渡すことで自己上限が違反された場合にエラーを報告します

### private なインライン関数の戻り値型における匿名型の近似

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 推論された戻り値型に匿名型が含まれている場合、private なインライン関数に対して警告を報告します
> - 2.0.0: このような private なインライン関数の戻り値型をスーパータイプに近似します

### ローカルな関数型プロパティの invoke コンベンションよりもローカルな拡張関数の呼び出しを優先するようにオーバーロード解決の振る舞いを変更

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しいオーバーロード解決の振る舞いを導入します。関数呼び出しが一貫して invoke コンベンションよりも優先されます

### バイナリ依存関係にあるスーパータイプの変更により継承メンバーの衝突が発生した場合にエラーを報告

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: バイナリ依存関係にあるスーパータイプで継承メンバーの衝突が発生している宣言に対して、警告 `CONFLICTING_INHERITED_MEMBERS_WARNING` を報告します
> - 2.0.0: 警告をエラー `CONFLICTING_INHERITED_MEMBERS` に引き上げます

### 不変（invariant）な型のパラメータにおける @UnsafeVariance アノテーションを無視

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。反変なパラメータの型不一致に関するエラーを報告する際、`@UnsafeVariance` アノテーションを無視します

### コンパニオンオブジェクトのメンバーに対する out-of-call 参照の型を変更

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: アンバウンド（非拘束）参照として推論されたコンパニオンオブジェクト関数の参照型に対して警告を報告します
> - 2.0.0: すべての使用コンテキストにおいて、コンパニオンオブジェクト関数の参照がバウンド（拘束）参照として推論されるように振る舞いを変更します

### private なインライン関数からの匿名型の露出を禁止

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: private なインライン関数から返された匿名オブジェクトの独自のメンバーへの呼び出しに対して警告を報告します
> - 2.0.0: このような private なインライン関数の戻り値型をスーパータイプに近似し、匿名オブジェクトメンバーへの呼び出しを解決しないようにします

### while ループの break 後の安全でないスマートキャストに対してエラーを報告

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。以前の振る舞いは言語バージョンを 1.9 に切り替えることで復元できます

### 交差型（intersection type）の変数にその交差型のサブタイプではない値が代入された場合にエラーを報告

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 交差型を持つ変数に、その交差型のサブタイプではない値が代入された場合にエラーを報告します

### SAM コンストラクタで構築されたインターフェースにオプトインが必要なメソッドが含まれている場合に、オプトインを要求

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: SAM コンストラクタを介した `OptIn` の使用に対して警告を報告します
> - 2.0.0: SAM コンストラクタを介した `OptIn` の使用に対する警告をエラーに引き上げます（`OptIn` マーカーの深刻度が警告である場合は警告の報告を継続します）

### typealias コンストラクタにおける上限境界の違反を禁止

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: typealias コンストラクタで上限境界が違反された場合の警告を導入します
> - 2.0.0: K2 コンパイラにおいて警告をエラーに引き上げます

### 分解宣言の変数の実際の型を、指定された場合は明示的な型と一致させる

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。明示的な型が指定された場合、分解宣言の変数の実際の型が一貫したものになります

### オプトインを必要とするデフォルト値を持つパラメータ型があるコンストラクタを呼び出す際に、オプトインを要求

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: オプトインを必要とするパラメータ型を持つコンストラクタ呼び出しに対して警告を報告します
> - 2.0.0: 警告をエラーに引き上げます（`OptIn` マーカーの深刻度が警告である場合は警告の報告を継続します）

### 同じスコープ階層にある同名のプロパティと Enum エントリ間の曖昧さを報告

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 同じスコープ階層で Enum エントリではなくプロパティに解決される場合に警告を報告します
> - 2.0.0: K2 コンパイラにおいて、同じスコープ階層で同じ名前のプロパティと Enum エントリの両方に遭遇した場合、曖昧さとして報告します（古いコンパイラでは警告のまま維持されます）

### Enum エントリよりもコンパニオンプロパティを優先するように修飾子の解決の振る舞いを変更

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい解決の振る舞いを実装します。Enum エントリよりもコンパニオンプロパティが優先されます

### invoke 演算子コンベンションの呼び出しのレシーバー型と invoke 関数型を、糖衣構文を解除した形式で記述されたかのように解決

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: invoke 呼び出しのレシーバー型と invoke 関数型を、糖衣構文を解除した（desugared）形式で記述されたかのように、それぞれ独立して解決します

### private ではないインライン関数を通じて private なクラスメンバーを露出させることを禁止

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 内部（internal）インライン関数から private クラスのコンパニオンオブジェクトメンバーを呼び出す際に `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告を報告します
> - 2.0.0: この警告を `PRIVATE_CLASS_MEMBER_FROM_INLINE` エラーに引き上げます

### プロジェクションされたジェネリック型における Definitely Non-Null 型の Null 許容性を修正

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。プロジェクションされた型において、すべてのインプレースな非 Null 型が考慮されます

### 前置インクリメントの推論される型を、inc() 演算子の戻り値型ではなくゲッターの戻り値型に一致するように変更

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。前置インクリメントの推論される型が、`inc()` 演算子の戻り値型ではなくゲッターの戻り値型に一致するように変更されます

### スーパークラスで宣言されたジェネリックなインナークラスからインナークラスを継承する際の境界チェックを強制

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリックなインナースーパークラスの型パラメータの上限境界が違反された場合にエラーを報告します

### 期待される型が関数型のパラメータを持つ関数型である場合に、SAM 型を持つ呼び出し可能参照の代入を禁止

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 期待される型が関数型のパラメータを持つ関数型である場合に、SAM 型を持つ呼び出し可能参照に対してコンパイルエラーを報告します

### コンパニオンオブジェクト上のアノテーション解決において、コンパニオンオブジェクトのスコープを考慮

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。コンパニオンオブジェクト上のアノテーション解決時に、コンパニオンオブジェクトのスコープが無視されなくなります

### セーフコールとコンベンション演算子の組み合わせに対する評価セマンティクスを変更

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: 各誤った呼び出しに対して警告を報告します
> - 2.0.0: 新しい解決の振る舞いを実装します

### バッキングフィールドとカスタムセッターを持つプロパティの即時初期化を要求

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: プライマリコンストラクタがない場合に `MUST_BE_INITIALIZED` 警告を導入します
> - 2.0.0: 警告をエラーに引き上げます

### invoke 演算子コンベンションの呼び出しにおける、任意の式に対する Unit 変換を禁止

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 変数および invoke の解決において、任意の式に Unit 変換が適用された場合にエラーを報告します。影響を受ける式に対して以前の振る舞いを維持するには、`-XXLanguage:+UnitConversionsOnArbitraryExpressions` コンパイラオプションを使用してください。

### セーフコールでアクセスされる非 Null の Java フィールドへの Null 許容値の代入を禁止

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 非 Null の Java フィールドに Null 許容値が代入された場合にエラーを報告します

### raw 型のパラメータを含む Java メソッドをオーバーライドする際にスタープロジェクションされた型を要求

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。raw 型パラメータのオーバーライドを禁止します

### V がコンパニオンを持つ場合の (V)::foo 参照解決の変更

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: 現在コンパニオンオブジェクトインスタンスにバインドされている呼び出し可能参照に対して警告を報告します
> - 2.0.0: 新しい振る舞いを実装します。型の周囲に括弧を追加しても、その型のコンパニオンオブジェクトインスタンスへの参照とはみなされなくなります

### 実質的に public なインライン関数内での暗黙的な非公開 API へのアクセスを禁止

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: public なインライン関数内で暗黙的な非公開 API がアクセスされた場合にコンパイル警告を報告します
> - 2.0.0: 警告をエラーに引き上げます

### プロパティゲッターにおける get 使用箇所ターゲット（use-site）アノテーションを禁止

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: ゲッターにおける `get` 使用箇所ターゲットアノテーションに対して警告を報告します（progressive モードではエラー）
> - 2.0.0: 警告を `INAPPLICABLE_TARGET_ON_PROPERTY` エラーに引き上げます。警告に戻すには `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` を使用してください。

### ビルダー推論ラムダ関数において、型パラメータが上限境界へと暗黙的に推論されるのを防止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 型引数の型パラメータが宣言された上限境界に推論できない場合に、警告（progressive モードではエラー）を報告します
> - 2.0.0: 警告をエラーに引き上げます

### 公開シグネチャにおけるローカル型の近似時に Null 許容性を維持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: フレキシブルな型（flexible types）がフレキシブルなスーパータイプによって近似されます。本来 Null 許容であるべき宣言が非 Null 型として推論された場合に警告を報告し、NPE を避けるために明示的に型を指定するよう促します
> - 2.0.0: Null 許容型は Null 許容なスーパータイプによって近似されます

### スマートキャストを目的とした false && ... および false || ... の特別な処理を削除

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい振る舞いを実装します。`false && ...` および `false || ...` に対する特別な処理は行われません

### Enum 内の inline open 関数を禁止

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: Enum 内の inline open 関数に対して警告を報告します
> - 2.0.0: 警告をエラーに引き上げます

## ツール

### Gradle における可視性の変更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以前は、特定の DSL コンテキストを意図した特定の Kotlin DSL 関数やプロパティが、意図せず他の DSL コンテキストに漏れ出していました。`@KotlinGradlePluginDsl` アノテーションを追加したことで、Kotlin Gradle プラグインの DSL 関数やプロパティが、意図されていないレベルに公開されるのを防ぎます。以下のレベルが相互に分離されます。
> * Kotlin extension
> * Kotlin target
> * Kotlin compilation
> * Kotlin compilation task
>
> **Deprecation cycle**:
>
> - 2.0.0: 多くの一般的なケースにおいて、ビルドスクリプトが誤って設定されている場合に、コンパイラは修正案を含む警告を報告します。それ以外の場合、コンパイラはエラーを報告します

### kotlinOptions DSL の非推奨化

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlinOptions` DSL および関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介したコンパイラオプションの設定機能が非推奨となりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告します

### KotlinCompilation DSL における compilerOptions の非推奨化

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilation` DSL における `compilerOptions` プロパティを設定する機能が非推奨となりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告します

### CInteropProcess 処理の古い方法を非推奨化

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` タスクおよび `CInteropSettings` クラスは、`defFile` および `defFileProperty` の代わりに `definitionFile` プロパティを使用するようになりました。
> 
> これにより、`defFile` が動的に生成される場合に、`CInteropProcess` タスクと `defFile` を生成するタスクとの間に余分な `dependsOn` 関係を追加する必要がなくなります。
> 
> Kotlin/Native プロジェクトにおいて、Gradle はビルドプロセスの後半で関連するタスクが実行された後に、`definitionFile` プロパティの存在を遅延検証するようになりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` および `defFileProperty` パラメータは非推奨となりました
> - 2.4.0: [非推奨となった defFile プロパティに対してエラーを報告します](compatibility-guide-24.md#report-errors-for-obsolete-kotlin-native-gradle-task-apis)

### kotlin.useK2 Gradle プロパティの削除

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradle プロパティが削除されました。Kotlin 1.9.* では、K2 コンパイラを有効にするために使用されていました。Kotlin 2.0.0 以降では K2 コンパイラがデフォルトで有効になるため、このプロパティは何の効果も持たず、以前のコンパイラに戻すために使用することもできません。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradle プロパティは非推奨となりました
> - 2.0.0: `kotlin.useK2` Gradle プロパティは削除されました

### 非推奨のプラットフォームプラグイン ID の削除

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以下のプラットフォームプラグイン ID のサポートが削除されました。
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: プラットフォームプラグイン ID は非推奨となりました
> - 2.0.0: プラットフォームプラグイン ID はサポートされなくなりました

### outputFile JavaScript コンパイラオプションの削除

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScript コンパイラオプションが削除されました。代わりに、`Kotlin2JsCompile` タスクの `destinationDirectory` プロパティを使用して、コンパイルされた JavaScript 出力ファイルが書き込まれるディレクトリを指定できます。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` コンパイラオプションは非推奨となりました
> - 2.0.0: `outputFile` コンパイラオプションは削除されました