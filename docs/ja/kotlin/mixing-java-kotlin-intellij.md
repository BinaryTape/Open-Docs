[//]: # (title: JavaとKotlinを1つのプロジェクトで混在させる – チュートリアル)

KotlinはJavaとの優れた相互運用性を提供し、最新のIDEはそれをさらに向上させます。
このチュートリアルでは、IntelliJ IDEAでKotlinとJavaの両方のソースコードを同じプロジェクトで使う方法を学習します。
IntelliJ IDEAで新しいKotlinプロジェクトを開始する方法については、[IntelliJ IDEAでの開始方法](jvm-get-started.md)を参照してください。

## 既存のKotlinプロジェクトにJavaソースコードを追加する

KotlinプロジェクトにJavaクラスを追加するのは非常に簡単です。新しいJavaファイルを作成するだけです。
プロジェクト内のディレクトリまたはパッケージを選択し、**File** | **New** | **Java Class** に移動するか、**Alt + Insert**/**Cmd + N** ショートカットを使用します。

![新しいJavaクラスの追加](new-java-class.png){width=400}

すでにJavaクラスがある場合は、それらをプロジェクトディレクトリにコピーするだけでかまいません。

これで、追加の操作なしでKotlinからJavaクラスを利用したり、その逆を行ったりすることができます。

例えば、以下のJavaクラスを追加すると：

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

Kotlinから、他のKotlinの型と同様に呼び出すことができます。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 既存のJavaプロジェクトにKotlinソースコードを追加する

既存のJavaプロジェクトにKotlinファイルを追加するのもほぼ同じです。

![新しいKotlinファイルクラスの追加](new-kotlin-file.png){width=400}

このプロジェクトにKotlinファイルを初めて追加する場合、IntelliJ IDEAは必要なKotlinランタイムを自動的に追加します。

![Kotlinランタイムのバンドル](bundling-kotlin-option.png){width=350}

また、**Tools** | **Kotlin** | **Configure Kotlin in Project** から手動でKotlinランタイム設定を開くこともできます。

## J2Kで既存のJavaファイルをKotlinに変換する

Kotlinプラグインには、JavaファイルをKotlinに自動変換するJavaからKotlinへのコンバーター（_J2K_）も同梱されています。
ファイルでJ2Kを使用するには、そのコンテキストメニューまたはIntelliJ IDEAの**Code**メニューで**Convert Java File to Kotlin File**をクリックします。

![JavaからKotlinへ変換](convert-java-to-kotlin.png){width=500}

このコンバーターは完璧ではありませんが、ほとんどのJavaのボイラープレートコードをKotlinに変換するのに十分な働きをします。ただし、手動での調整が時々必要になります。