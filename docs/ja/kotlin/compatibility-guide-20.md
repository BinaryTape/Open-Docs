[//]: # (title: Kotlin 2.0 互換性ガイド)

_[言語を現代的に保つ](kotlin-evolution-principles.md)_ ことと、_[快適な更新](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構文は削除されるべきだと述べ、後者は、コードの移行を可能な限りスムーズにするために、この削除が事前に十分に通知されるべきだと述べています。

ほとんどの言語変更は、更新された変更ログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントはKotlin 1.9からKotlin 2.0への移行に関する完全なリファレンスを提供します。

> Kotlin K2コンパイラはKotlin 2.0の一部として導入されます。新しいコンパイラの利点、移行中に遭遇する可能性のある変更点、および以前のコンパイラに戻す方法については、[K2コンパイラの移行ガイド](k2-compiler-migration-guide.md)を参照してください。
>
{style="note"}

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース互換性_: ソース非互換の変更により、以前は問題なく（エラーや警告なしに）コンパイルできていたコードがコンパイルできなくなります。
- _バイナリ互換性_: 2つのバイナリアーティファクトは、それらを入れ替えてもローディングエラーやリンケージエラーが発生しない場合にバイナリ互換性があるとされます。
- _動作互換性_: 変更が適用される前と後で同じプログラムが異なる動作を示す場合、その変更は動作非互換であるとされます。

これらの定義は、純粋なKotlinに対してのみ与えられていることを忘れないでください。他の言語の観点（例えばJava）からのKotlinコードの互換性については、このドキュメントの範囲外です。

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

### 射影されたレシーバーでの合成セッターの使用を非推奨化

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Javaクラスの合成セッターを使用して、クラスの射影型と競合する型を割り当てると、エラーが発生するようになりました。
>
> **Deprecation cycle**:
>
> - 1.8.20: 合成プロパティセッターが反変位置に射影されたパラメーター型を持ち、呼び出しサイトの引数型が非互換になる場合に警告を報告
> - 2.0.0: 警告をエラーに昇格

### Javaサブクラスでオーバーロードされたインラインクラスパラメーターを持つ関数を呼び出す際の正しいマングリング

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 関数呼び出しで正しいマングリング動作を使用します。以前の動作に戻すには、`-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses`コンパイラオプションを使用します。

### 反変なキャプチャ型に対する正しい型近似アルゴリズム

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.20: 問題のある呼び出しで警告を報告
> - 2.0.0: 警告をエラーに昇格

### プロパティ初期化前のプロパティ値アクセスを禁止

> **Issue**: [KT-56408](https://youtrack.com/issue/KT-56408)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 影響を受けるコンテキストでプロパティが初期化前にアクセスされた場合にエラーを報告

### 同じ名前のインポートされたクラスに曖昧さがある場合にエラーを報告

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: スターインポートでインポートされた複数のパッケージに存在するクラス名を解決する際にエラーを報告

### デフォルトで`invokedynamic`と`LambdaMetafactory`を介してKotlinラムダを生成

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。ラムダはデフォルトで`invokedynamic`と`LambdaMetafactory`を使用して生成されます。

### 式が必要な場合に1つの分岐しかない`if`条件を禁止

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: `if`条件に1つの分岐しかない場合にエラーを報告

### ジェネリック型のスター射影を渡すことによる自己上限違反を禁止

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリック型のスター射影を渡すことで自己上限が侵害される場合にエラーを報告

### プライベートなインライン関数の戻り値型における匿名型の近似

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.9.0: 推論された戻り値型に匿名型が含まれるプライベートなインライン関数で警告を報告
> - 2.0.0: そのようなプライベートなインライン関数の戻り値型をスーパータイプに近似

### オーバーロード解決の動作を変更し、ローカルな関数型プロパティの`invoke`規約よりもローカルな拡張関数呼び出しを優先する

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しいオーバーロード解決の動作。関数呼び出しが`invoke`規約よりも一貫して優先されます。

### バイナリ依存関係からのスーパークラスの変更により継承されたメンバーの競合が発生した場合にエラーを報告

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.7.0: バイナリ依存関係からのスーパークラスで継承されたメンバーの競合が発生した宣言で警告`CONFLICTING_INHERITED_MEMBERS_WARNING`を報告
> - 2.0.0: 警告をエラー`CONFLICTING_INHERITED_MEMBERS`に昇格

### 不変型におけるパラメーターの`@UnsafeVariance`アノテーションを無視

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。`@UnsafeVariance`アノテーションは、反変なパラメーターにおける型不一致に関するエラー報告時に無視されます。

### コンパニオンオブジェクトのメンバーへの呼び出し外部参照の型を変更

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.20: コンパニオンオブジェクト関数の参照型がバインドされていない参照として推論される場合に警告を報告
> - 2.0.0: コンパニオンオブジェクト関数の参照がすべての使用コンテキストでバインドされた参照として推論されるように動作を変更

### プライベートなインライン関数からの匿名型の公開を禁止

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.3.0: プライベートなインライン関数から返される匿名オブジェクトの自身のメンバーへの呼び出しで警告を報告
> - 2.0.0: そのようなプライベートなインライン関数の戻り値型をスーパータイプに近似し、匿名オブジェクトメンバーへの呼び出しを解決しない

### `while`ループの`break`後の不健全なスマートキャストに対してエラーを報告

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。古い動作は言語バージョン1.9に切り替えることで復元できます。

### 交差型の変数に、その交差型のサブタイプではない値が代入された場合にエラーを報告

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 交差型を持つ変数に、その交差型のサブタイプではない値が代入された場合にエラーを報告

### SAMコンストラクタで構築されたインターフェースに`opt-in`を必要とするメソッドが含まれる場合に、`opt-in`を必須とする

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.7.20: SAMコンストラクタを介した`OptIn`の使用で警告を報告
> - 2.0.0: SAMコンストラクタを介した`OptIn`の使用で警告をエラーに昇格（または`OptIn`マーカーの重大度が警告の場合は警告のまま）

### タイプエイリアスコンストラクタにおける上限違反を禁止

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.0: タイプエイリアスコンストラクタで上限が侵害される場合に警告を導入
> - 2.0.0: K2コンパイラで警告をエラーに昇格

### 分割代入変数の実際の型を、明示的に指定された型と一致させる

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。分割代入変数の実際の型は、指定された場合に明示的な型と一致するようになりました。

### デフォルト値を持つパラメーター型が`opt-in`を必要とするコンストラクタを呼び出す際に、`opt-in`を必須とする

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.20: `opt-in`を必要とするパラメーター型を持つコンストラクタ呼び出しで警告を報告
> - 2.0.0: 警告をエラーに昇格（または`OptIn`マーカーの重大度が警告の場合は警告のまま）

### 同じスコープレベルで同じ名前のプロパティとenumエントリの間の曖昧さを報告

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.7.20: コンパイラが同じスコープレベルでenumエントリではなくプロパティに解決する場合に警告を報告
> - 2.0.0: K2コンパイラで同じスコープレベルで同じ名前のプロパティとenumエントリの両方に遭遇した場合に曖昧さを報告（古いコンパイラでは警告のまま）

### 修飾子解決の動作を変更し、enumエントリよりもコンパニオンプロパティを優先する

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい解決動作を実装します。コンパニオンプロパティがenumエントリよりも優先されます。

### `invoke`呼び出しレシーバー型と`invoke`関数型を、デシュガーされた形式で記述されたかのように解決する

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: `invoke`呼び出しレシーバー型と`invoke`関数型を、デシュガーされた形式で記述されたかのように独立して解決します。

### 非プライベートなインライン関数を介したプライベートクラスメンバーの公開を禁止

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.9.0: 内部インライン関数からプライベートクラスコンパニオンオブジェクトメンバーを呼び出す際に`PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING`警告を報告
> - 2.0.0: この警告を`PRIVATE_CLASS_MEMBER_FROM_INLINE`エラーに昇格

### 射影されたジェネリック型における確実な非NULL型のnull許容性を修正

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。射影された型は、すべてのインプレースな非null型を考慮に入れるようになりました。

### プリフィックスインクリメントの推論型を、`inc()`演算子の戻り値型ではなくゲッターの戻り値型と一致するように変更

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。プリフィックスインクリメントの推論型は、`inc()`演算子の戻り値型ではなくゲッターの戻り値型と一致するように変更されます。

### スーパークラスで宣言されたジェネリックなインナークラスからインナークラスを継承する際に境界チェックを強制

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリックなインナースーパークラスの型パラメータの上限が侵害された場合にエラーを報告

### 予想される型が関数型パラメータを持つ関数型である場合、SAM型を持つ呼び出し可能参照の代入を禁止

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 予想される型が関数型パラメータを持つ関数型である場合、SAM型を持つ呼び出し可能参照に対してコンパイルエラーを報告

### コンパニオンオブジェクト上のアノテーション解決のためにコンパニオンオブジェクトスコープを考慮

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。コンパニオンオブジェクト上のアノテーション解決時にコンパニオンオブジェクトスコープが無視されなくなりました。

### セーフコールと規約演算子の組み合わせに対する評価セマンティクスを変更

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 1.4.0: 各不正な呼び出しで警告を報告
> - 2.0.0: 新しい解決動作を実装

### バッキングフィールドとカスタムセッターを持つプロパティはすぐに初期化されるように要求

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 1.9.20: プライマリコンストラクタがない場合に`MUST_BE_INITIALIZED`警告を導入
> - 2.0.0: 警告をエラーに昇格

### `invoke`演算子規約呼び出しにおける任意の式への`Unit`変換を禁止

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 変数と`invoke`解決で`Unit`変換が任意の式に適用された場合にエラーを報告します。影響を受ける式で以前の動作を維持するには、`-XXLanguage:+UnitConversionsOnArbitraryExpressions`コンパイラオプションを使用します。

### セーフコールでアクセスされる場合に、null許容を非null Javaフィールドへの割り当てを禁止

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: null許容が非null Javaフィールドに割り当てられた場合にエラーを報告

### 生型パラメータを含むJavaメソッドをオーバーライドする際に、スター射影型を要求

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。生型パラメータのオーバーライドは禁止されます。

### `V`がコンパニオンを持つ場合の`(V)::foo`参照解決を変更

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: コア言語
>
> **Incompatible change type**: 動作非互換
>
> **Deprecation cycle**:
>
> - 1.6.0: 現在コンパニオンオブジェクトインスタンスにバインドされている呼び出し可能参照で警告を報告
> - 2.0.0: 新しい動作を実装します。型を括弧で囲んでも、その型のコンパニオンオブジェクトインスタンスへの参照とはならなくなりました。

### 実質的にパブリックなインライン関数での暗黙的な非パブリックAPIアクセスを禁止

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.20: パブリックなインライン関数で暗黙的な非パブリックAPIがアクセスされた場合にコンパイル警告を報告
> - 2.0.0: 警告をエラーに昇格

### プロパティゲッターに対するuse-site `get`アノテーションを禁止

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.9.0: ゲッターに対するuse-site `get`アノテーションで警告を報告（プログレッシブモードではエラー）
> - 2.0.0: 警告を`INAPPLICABLE_TARGET_ON_PROPERTY`エラーに昇格します。警告に戻すには`-XXLanguage:-ProhibitUseSiteGetTargetAnnotations`を使用します。

### ビルダー推論ラムダ関数において、型パラメータが上限に暗黙的に推論されるのを防止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.7.20: 型引数の型パラメータが宣言された上限に推論できない場合に警告を報告（またはプログレッシブモードではエラー）
> - 2.0.0: 警告をエラーに昇格

### パブリックシグネチャでローカル型を近似する際にnull許容性を保持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.0: フレキシブル型はフレキシブルなスーパータイプによって近似されます。宣言がnullableであるべき非nullable型を持つと推論され、NPEを回避するために型を明示的に指定するように促す警告を報告
> - 2.0.0: nullable型はnullableなスーパータイプによって近似されます

### スマートキャストの目的のための`false && ...`と`false || ...`の特別な処理を削除

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。`false && ...`と`false || ...`に特別な処理はなくなります。

### enumにおけるインライン`open`関数を禁止

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Deprecation cycle**:
>
> - 1.8.0: enumにおけるインライン`open`関数で警告を報告
> - 2.0.0: 警告をエラーに昇格

## ツール

### Gradleにおける可視性の変更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: 以前は、特定のDSLコンテキスト向けに意図された一部のKotlin DSL関数およびプロパティが、意図せず他のDSLコンテキストに漏洩することがありました。`@KotlinGradlePluginDsl`アノテーションを追加し、Kotlin GradleプラグインのDSL関数とプロパティが意図されていないレベルに公開されるのを防ぐようにしました。以下のレベルは互いに分離されています。
> * Kotlin extension
> * Kotlin target
> * Kotlin compilation
> * Kotlin compilation task
>
> **Deprecation cycle**:
>
> - 2.0.0: ほとんどの一般的なケースでは、ビルドスクリプトが誤って設定されている場合に、コンパイラが修正方法の提案を含む警告を報告します。それ以外の場合は、コンパイラがエラーを報告します。

### `kotlinOptions` DSLの非推奨化

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `kotlinOptions` DSLおよび関連する`KotlinCompile<KotlinOptions>`タスクインターフェースを介してコンパイラオプションを設定する機能が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告

### `KotlinCompilation` DSLにおける`compilerOptions`の非推奨化

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `KotlinCompilation` DSLにおける`compilerOptions`プロパティを設定する機能が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告

### `CInteropProcess`処理の古い方法を非推奨化

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `CInteropProcess`タスクと`CInteropSettings`クラスは、`defFile`と`defFileProperty`の代わりに`definitionFile`プロパティを使用するようになりました。
>
> これにより、`defFile`が動的に生成される場合に、`CInteropProcess`タスクと`defFile`を生成するタスクの間に追加の`dependsOn`関係を追加する必要がなくなります。
>
> Kotlin/Nativeプロジェクトでは、Gradleはビルドプロセスの後半で接続されたタスクが実行された後に、`definitionFile`プロパティの存在を遅延して検証するようになりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile`と`defFileProperty`パラメーターが非推奨になりました。

### `kotlin.useK2` Gradleプロパティの削除

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: 動作非互換
>
> **Short summary**: `kotlin.useK2` Gradleプロパティは削除されました。Kotlin 1.9.*では、K2コンパイラを有効にするために使用できましたが、Kotlin 2.0.0以降ではK2コンパイラがデフォルトで有効になっているため、このプロパティは効果がなく、以前のコンパイラに戻すために使用することはできません。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradleプロパティは非推奨になりました
> - 2.0.0: `kotlin.useK2` Gradleプロパティは削除されました

### 非推奨のプラットフォームプラグインIDの削除

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: これらのプラットフォームプラグインIDのサポートは削除されました。
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: プラットフォームプラグインIDは非推奨になりました
> - 2.0.0: プラットフォームプラグインIDはサポートされなくなりました

### `outputFile` JavaScriptコンパイラオプションの削除

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `outputFile` JavaScriptコンパイラオプションは削除されました。代わりに、`Kotlin2JsCompile`タスクの`destinationDirectory`プロパティを使用して、コンパイルされたJavaScript出力ファイルが書き込まれるディレクトリを指定できます。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile`コンパイラオプションは非推奨になりました
> - 2.0.0: `outputFile`コンパイラオプションは削除されました