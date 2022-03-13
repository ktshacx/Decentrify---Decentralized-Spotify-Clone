//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Decentrify {
    string public name = "Decentrify";

    uint public MusicCount = 0;
    mapping(uint => Music) public musics;

    struct Music {
        uint id;
        string name;
        string hash;
        string publisher;
        address creator;
    }

    event MusicCreated (
        uint id,
        string name,
        string hash,
        string publisher,
        address creator
    );

    function uploadMusic(string memory _hash, string memory _name, string memory _publisher) public {
        MusicCount += 1;
        musics[MusicCount] = Music(MusicCount, _name, _hash, _publisher, msg.sender);
        emit MusicCreated(MusicCount, _name, _hash, _publisher, msg.sender);
    }
}