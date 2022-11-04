using Xunit;

public class Tests
{
    [Fact]
    public void Hello_ReturnsWorld() => Assert.Equal("World", Lib.Target());
}